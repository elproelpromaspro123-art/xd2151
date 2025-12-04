import express, { type Express, type Request, type Response, type NextFunction } from "express";
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
      `Could not find the build directory: ${distPath}. ` +
      `Run "npm run build" to generate the client build, or ensure the build was successful.`,
    );
  }
  
  const indexPath = path.join(distPath, "index.html");
  if (!fs.existsSync(indexPath)) {
    console.error(`[static] index.html not found at ${indexPath}`);
    console.error(`[static] Directory contents:`, fs.readdirSync(distPath));
    throw new Error(
      `Could not find index.html at ${indexPath}. ` +
      `The client build may have failed. Check the build logs.`
    );
  }
  
  console.log(`[static] Build directory found, serving from ${distPath}`);
  console.log(`[static] index.html verified at ${indexPath}`);
  console.log(`[static] Static assets directory size:`, fs.readdirSync(distPath).length, "items");

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

  app.use("*", (req: Request, res: Response, next: NextFunction) => {
    // Don't serve static files for API or health check routes
    if (req.originalUrl.startsWith("/api") || req.originalUrl === "/health") {
      return next();
    }
    
    // Serve index.html for all other routes (SPA)
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.sendFile(indexPath, (err) => {
      if (err) {
        console.error(`[static] Error serving index.html for ${req.originalUrl}:`, err.message);
        res.status(500).json({ error: "Error loading application" });
      }
    });
  });
}
