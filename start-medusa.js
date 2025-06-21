const { startMedusa } = require("@medusajs/medusa");
const path = require("path");

const configPath = path.resolve(__dirname, "medusa-config.js");

console.log("Starting Medusa server...");
console.log("Config path:", configPath);

startMedusa({
  directory: __dirname,
  port: 9000,
  host: "localhost"
}).then(() => {
  console.log("✅ Medusa server started successfully!");
}).catch((error) => {
  console.error("❌ Error starting Medusa server:", error);
  process.exit(1);
});
