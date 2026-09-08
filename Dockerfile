FROM ruby:latest

# Install dependencies
RUN apt-get update && \
    apt-get install -y build-essential zlib1g-dev

# Install Jekyll
RUN gem install jekyll bundler

# Set the working directory
WORKDIR /app

# Copy the source code into the container
COPY . .

# Install dependencies
RUN bundle install

# Expose the default Jekyll port (4000)
EXPOSE 4000

# Start Jekyll server
CMD ["bundle", "exec", "jekyll", "serve", "--host=0.0.0.0"]
