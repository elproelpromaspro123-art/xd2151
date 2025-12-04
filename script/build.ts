import { build as esbuild } from "esbuild";
import { build as viteBuild } from "vite";
import { rm, readFile } from "fs/promises";

// server deps to bundle to reduce openat(2) syscalls
// which helps cold start times
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
  "vite",
  "fs",
  "path",
  "crypto",
];

async function buildAll() {
  const startTime = Date.now();
  
  try {
    await rm("dist", { recursive: true, force: true });

    console.log("building client...");
    const clientStart = Date.now();
    await viteBuild();
    console.log(`client build completed in ${Date.now() - clientStart}ms`);

    console.log("building server...");
    const serverStart = Date.now();
    const pkg = JSON.parse(await readFile("package.json", "utf-8"));
    const allDeps = [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.devDependencies || {}),
    ];
    const externals = allDeps.filter((dep) => !allowlist.includes(dep));

    console.log(`bundling ${allowlist.length} modules, excluding ${externals.length} external modules`);

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
      logLevel: "info",
    });
    console.log(`server build completed in ${Date.now() - serverStart}ms`);
    console.log(`total build time: ${Date.now() - startTime}ms`);
  } catch (error) {
    console.error("Build error:", error);
    throw error;
  }
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
