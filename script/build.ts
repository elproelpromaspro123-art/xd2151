import { build as esbuild } from "esbuild";
import { build as viteBuild } from "vite";
import { rm, readFile, access, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const allowlist = [
  "@google/generative-ai",
  "@neondatabase/serverless",
  "axios",
  "connect-pg-simple",
  "cors",
  "date-fns",
  "drizzle-orm",
  "drizzle-zod",
  "express",
  "express-rate-limit",
  "express-session",
  "jsonwebtoken",
  "memorystore",
  "multer",
  "nanoid",
  "nodemailer",
  "openai",
  "passport",
  "passport-local",
  "stripe",
  "uuid",
  "ws",
  "xlsx",
  "zod",
  "zod-validation-error",
];

async function buildAll() {
  const startTime = Date.now();
  const buildTimeout = setTimeout(() => {
    console.error("\nBUILD TIMEOUT: Build took longer than 5 minutes");
    process.exit(1);
  }, 5 * 60 * 1000); // 5 minute timeout
  
  console.log("=".repeat(50));
  console.log("BUILD STARTED");
  console.log(`Node version: ${process.version}`);
  console.log(`Working directory: ${process.cwd()}`);
  console.log(`Platform: ${process.platform}`);
  console.log("=".repeat(50));
  
  try {
    console.log("\n[1/4] Cleaning dist directory...");
    await rm("dist", { recursive: true, force: true });
    await mkdir("dist", { recursive: true });
    console.log("✓ dist directory cleaned");

    console.log("\n[2/4] Building client with Vite...");
    const clientStart = Date.now();
    try {
      await viteBuild({
        logLevel: "warn", // Suppress verbose output
      });
    } catch (clientError) {
      console.error("Client build error:", clientError);
      throw new Error(`Client build failed: ${clientError instanceof Error ? clientError.message : String(clientError)}`);
    }
    console.log(`✓ Client build completed in ${Date.now() - clientStart}ms`);

    const publicPath = path.join(process.cwd(), "dist", "public");
    const indexPath = path.join(publicPath, "index.html");
    
    if (!existsSync(indexPath)) {
      throw new Error(`Client build failed: ${indexPath} not found after Vite build`);
    }
    console.log(`✓ Verified: ${indexPath} exists`);

    console.log("\n[3/4] Building server with esbuild...");
    const serverStart = Date.now();
    const pkg = JSON.parse(await readFile("package.json", "utf-8"));
    const allDeps = [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.devDependencies || {}),
    ];
    const externals = allDeps.filter((dep) => !allowlist.includes(dep));

    console.log(`  Bundling ${allowlist.filter(d => allDeps.includes(d)).length} modules`);
    console.log(`  External: ${externals.length} modules`);

    try {
      await esbuild({
        entryPoints: ["server/index.ts"],
        platform: "node",
        bundle: true,
        format: "cjs",
        outfile: "dist/index.cjs",
        define: {
          "process.env.NODE_ENV": '"production"',
        },
        minify: true,
        external: externals,
        logLevel: "error", // Only show errors
        sourcemap: false,
        treeShaking: true,
      });
    } catch (serverError) {
      console.error("Server build error:", serverError);
      throw new Error(`Server build failed: ${serverError instanceof Error ? serverError.message : String(serverError)}`);
    }
    console.log(`✓ Server build completed in ${Date.now() - serverStart}ms`);

    const serverPath = path.join(process.cwd(), "dist", "index.cjs");
    if (!existsSync(serverPath)) {
      throw new Error(`Server build failed: ${serverPath} not found`);
    }
    console.log(`✓ Verified: ${serverPath} exists`);

    console.log("\n[4/4] Build verification...");
    clearTimeout(buildTimeout);
    console.log("=".repeat(50));
    console.log("BUILD COMPLETED SUCCESSFULLY");
    console.log(`Total build time: ${Date.now() - startTime}ms`);
    console.log("=".repeat(50));
    
  } catch (error) {
    clearTimeout(buildTimeout);
    console.error("\n" + "=".repeat(50));
    console.error("BUILD FAILED");
    console.error("=".repeat(50));
    console.error(error instanceof Error ? error.message : String(error));
    if (error instanceof Error && error.stack) {
      console.error(error.stack);
    }
    throw error;
  }
}

buildAll().catch((err) => {
  console.error("Build process failed:", err.message);
  process.exit(1);
});
