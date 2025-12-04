import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  const distPath = path.join(process.cwd(), "dist", "public");
  console.log(`[static] Looking for build at: ${distPath}`);
  
  if (!fs.existsSync(distPath)) {
    console.error(`[static] Build directory not found at ${distPath}`);
    const parentDir = path.dirname(distPath);
    if (fs.existsSync(parentDir)) {
      console.log(`[static] Contents of ${parentDir}:`, fs.readdirSync(parentDir));
    }
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }
  console.log(`[static] Build directory found, serving from ${distPath}`);

  app.use(express.static(distPath, {
    maxAge: "1d",
    etag: true,
    lastModified: true,
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".html")) {
        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      } else if (filePath.match(/\.(js|css|woff2?|ttf|eot|svg|png|jpg|jpeg|gif|ico)$/)) {
        res.setHeader("Cache-Control", "public, max-age=86400, immutable");
      }
    }
  }));

  app.use("*", (_req, res) => {
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
