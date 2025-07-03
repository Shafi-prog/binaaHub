const dotenv = require("dotenv");
const path = require("path");

// Load .env.local file specifically
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

module.exports = {
  projectConfig: {
    // Use remote Supabase since connection is working
    database_url: process.env.DATABASE_URL,
    database_type: "postgres",
    redis_url: process.env.REDIS_URL || "redis://localhost:6379",
    jwt_secret: process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || "binaa_super_secret_key_2025",
    cookie_secret: process.env.COOKIE_SECRET || process.env.NEXTAUTH_SECRET || "binaa_super_secret_key_2025",
    store_cors: process.env.STORE_CORS || "http://localhost:3000,http://localhost:8000",
    admin_cors: process.env.ADMIN_CORS || "http://localhost:3000,http://localhost:9000",
  },
  plugins: [],
};
