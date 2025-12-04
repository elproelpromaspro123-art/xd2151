import { existsSync } from "fs";
import path from "path";

function verify() {
  console.log("=".repeat(50));
  console.log("DEPLOYMENT VERIFICATION");
  console.log("=".repeat(50));

  const checks: Array<{ name: string; path: string; optional: boolean }> = [
    { name: "Server bundle", path: "dist/index.cjs", optional: false },
    { name: "Client build", path: "dist/public/index.html", optional: false },
    { name: "Client assets", path: "dist/public/assets", optional: false },
    { name: "Render config", path: "render.yaml", optional: false },
    { name: "Package.json", path: "package.json", optional: false },
  ];

  let allPassed = true;

  for (const check of checks) {
    const fullPath = path.join(process.cwd(), check.path);
    const exists = existsSync(fullPath);
    const status = exists ? "✓" : "✗";
    const message = exists ? "OK" : "MISSING";

    if (!exists && !check.optional) {
      allPassed = false;
      console.log(`${status} ${check.name}: ${message}`);
    } else if (exists) {
      console.log(`${status} ${check.name}: ${message}`);
    }
  }

  console.log("=".repeat(50));

  if (!allPassed) {
    console.error("\nDEPLOYMENT CHECK FAILED");
    console.error("Missing required files for deployment");
    process.exit(1);
  }

  console.log("✓ All checks passed - ready for deployment!");
  console.log("\nNext steps:");
  console.log("1. Ensure DATABASE_URL is configured in Render dashboard");
  console.log("2. Ensure OPENROUTER_API_KEY is configured in Render dashboard");
  console.log("3. Push to your repository");
  console.log("4. Trigger deployment from Render dashboard");
  console.log("=".repeat(50));
}

verify();
