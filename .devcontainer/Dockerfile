# Binna Dev Container Dockerfile
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:20-bullseye

# Install additional OS packages if needed
RUN apt-get update && apt-get install -y \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Supabase CLI
RUN npm install -g supabase

# Set working directory
WORKDIR /workspace

# Copy package.json and install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy the rest of the project files
COPY . .

# Expose Next.js and Supabase ports
EXPOSE 3000 5432

CMD ["npm", "run", "dev"]
