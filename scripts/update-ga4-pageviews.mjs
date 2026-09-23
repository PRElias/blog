import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const POSTS_DIR = '_posts';
const OUTPUT_FILE = path.join('data', 'pageviews.json');
const PROPERTY_ID = process.env.GA4_PROPERTY_ID;
const ACCESS_TOKEN = process.env.GOOGLE_OAUTH_ACCESS_TOKEN;
const API_URL = `https://analyticsdata.googleapis.com/v1beta/properties/${PROPERTY_ID}:runReport`;
const PAGE_SIZE = 10000;

function normalizePath(value) {
  if (!value) return null;

  let pathname = String(value).trim();
  if (!pathname) return null;

  try {
    if (/^https?:\/\//i.test(pathname)) {
      pathname = new URL(pathname).pathname;
    }
  } catch {
    return null;
  }

  pathname = pathname.split('#')[0].split('?')[0];

  try {
    pathname = decodeURI(pathname);
  } catch {
    // Keep the original path when GA returns an encoded value that is not valid UTF-8.
  }

  if (!pathname.startsWith('/')) {
    pathname = `/${pathname}`;
  }

  pathname = pathname.replace(/\/{2,}/g, '/').replace(/\/index\.html$/i, '/');

  if (pathname !== '/' && !pathname.endsWith('/')) {
    pathname += '/';
  }

  return pathname;
}

function variantsFor(postPath) {
  const normalized = normalizePath(postPath);
  if (!normalized) return [];

  const withoutSlash = normalized.endsWith('/') && normalized !== '/'
    ? normalized.slice(0, -1)
    : normalized;

  return Array.from(new Set([
    normalized,
    withoutSlash,
    `${withoutSlash}/index.html`,
  ].map(normalizePath).filter(Boolean)));
}

function parseFrontMatter(markdown) {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};

  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const property = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!property) continue;

    const key = property[1];
    let value = property[2].trim();
    value = value.replace(/^['"]|['"]$/g, '');
    data[key] = value;
  }

  return data;
}

function permalinkFromFilename(fileName, frontMatter) {
  if (frontMatter.permalink) {
    return normalizePath(frontMatter.permalink);
  }

  const match = fileName.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)\.(?:md|markdown|html)$/i);
  if (!match) return null;

  const [, year, month, day, slug] = match;
  return normalizePath(`/${year}-${month}-${day}-${slug}/`);
}

function redirectPathsFromFrontMatter(markdown) {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return [];

  const lines = match[1].split(/\r?\n/);
  const redirects = [];

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const direct = line.match(/^redirect_from:\s*(.+)$/);
    if (direct) {
      redirects.push(direct[1].trim().replace(/^['"]|['"]$/g, ''));
      continue;
    }

    if (/^redirect_from:\s*$/.test(line)) {
      for (let nested = index + 1; nested < lines.length; nested += 1) {
        const item = lines[nested].match(/^\s*-\s*(.+)$/);
        if (!item) break;
        redirects.push(item[1].trim().replace(/^['"]|['"]$/g, ''));
      }
    }
  }

  return redirects.map(normalizePath).filter(Boolean);
}

async function loadPostPathMap() {
  const files = await readdir(POSTS_DIR);
  const aliases = new Map();
  const canonicalPaths = [];

  for (const fileName of files) {
    if (!/\.(?:md|markdown|html)$/i.test(fileName)) continue;

    const markdown = await readFile(path.join(POSTS_DIR, fileName), 'utf8');
    const frontMatter = parseFrontMatter(markdown);
    if (frontMatter.published === 'false') continue;

    const canonicalPath = permalinkFromFilename(fileName, frontMatter);
    if (!canonicalPath) continue;

    canonicalPaths.push(canonicalPath);

    for (const variant of variantsFor(canonicalPath)) {
      aliases.set(variant, canonicalPath);
    }

    for (const redirectPath of redirectPathsFromFrontMatter(markdown)) {
      for (const variant of variantsFor(redirectPath)) {
        aliases.set(variant, canonicalPath);
      }
    }
  }

  canonicalPaths.sort();
  return { aliases, canonicalPaths };
}

async function runReport(offset = 0) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      dateRanges: [{ startDate: '2015-08-14', endDate: 'yesterday' }],
      dimensions: [{ name: 'pagePath' }],
      metrics: [{ name: 'screenPageViews' }],
      offset,
      limit: PAGE_SIZE,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GA4 Data API returned ${response.status}: ${body}`);
  }

  return response.json();
}

async function fetchPageViews() {
  if (!PROPERTY_ID) {
    throw new Error('GA4_PROPERTY_ID is required.');
  }

  if (!ACCESS_TOKEN) {
    throw new Error('GOOGLE_OAUTH_ACCESS_TOKEN is required.');
  }

  const rows = [];
  let offset = 0;
  let rowCount = null;

  do {
    const report = await runReport(offset);
    const reportRows = report.rows || [];
    rows.push(...reportRows);
    rowCount = Number(report.rowCount || rows.length);
    offset += reportRows.length;
  } while (offset < rowCount && rows.length % PAGE_SIZE === 0);

  return rows;
}

async function main() {
  const { aliases, canonicalPaths } = await loadPostPathMap();
  const counts = Object.fromEntries(canonicalPaths.map((postPath) => [postPath, 0]));
  const rows = await fetchPageViews();

  for (const row of rows) {
    const reportedPath = normalizePath(row.dimensionValues?.[0]?.value);
    const canonicalPath = aliases.get(reportedPath);
    if (!canonicalPath) continue;

    const views = Number(row.metricValues?.[0]?.value || 0);
    counts[canonicalPath] += views;
  }

  for (const postPath of Object.keys(counts)) {
    if (counts[postPath] === 0) {
      delete counts[postPath];
    }
  }

  await mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
  await writeFile(OUTPUT_FILE, `${JSON.stringify(counts, null, 2)}\n`, 'utf8');

  console.log(`Updated ${OUTPUT_FILE} with ${Object.keys(counts).length} post paths.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
