(function () {
  function normalizePath(value) {
    if (!value) return null;

    var link = document.createElement('a');
    link.href = value;

    var pathname = link.pathname || value;
    pathname = pathname.split('#')[0].split('?')[0];

    try {
      pathname = decodeURI(pathname);
    } catch (error) {
      // Keep the browser-provided path when decoding is not possible.
    }

    if (pathname.charAt(0) !== '/') {
      pathname = '/' + pathname;
    }

    pathname = pathname.replace(/\/{2,}/g, '/').replace(/\/index\.html$/i, '/');

    if (pathname !== '/' && pathname.charAt(pathname.length - 1) !== '/') {
      pathname += '/';
    }

    return pathname;
  }

  function lookupCount(data, pathname) {
    var normalized = normalizePath(pathname);
    if (!normalized) return null;

    var withoutSlash = normalized !== '/' && normalized.charAt(normalized.length - 1) === '/'
      ? normalized.slice(0, -1)
      : normalized;

    var candidates = [
      normalized,
      withoutSlash,
      withoutSlash + '/index.html'
    ];

    for (var index = 0; index < candidates.length; index += 1) {
      var candidate = candidates[index];
      if (Object.prototype.hasOwnProperty.call(data, candidate)) {
        return Number(data[candidate]);
      }
    }

    return null;
  }

  function labelFor(count) {
    var formatted = count.toLocaleString('pt-BR');
    return formatted + (count === 1 ? ' visualização' : ' visualizações');
  }

  function hide(container) {
    container.setAttribute('hidden', '');
  }

  var container = document.querySelector('[data-pageviews]');
  if (!container || !window.fetch) return;

  var source = container.getAttribute('data-pageviews-src');
  var value = container.querySelector('[data-pageviews-value]');
  if (!source || !value) {
    hide(container);
    return;
  }

  fetch(source, { credentials: 'same-origin' })
    .then(function (response) {
      if (!response.ok) throw new Error('Pageviews JSON not available.');
      return response.json();
    })
    .then(function (data) {
      var count = lookupCount(data, window.location.pathname);
      if (!Number.isFinite(count) || count <= 0) {
        hide(container);
        return;
      }

      value.textContent = labelFor(count);
      container.removeAttribute('aria-busy');
      container.className += ' post-pageviews-loaded';
    })
    .catch(function () {
      hide(container);
    });
}());
