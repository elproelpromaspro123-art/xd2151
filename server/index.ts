import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";

const app = express();
const httpServer = createServer(app);

declare module "http" {
    interface IncomingMessage {
        rawBody: unknown;
    }
}

export function log(message: string, source = "express") {
    const formattedTime = new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
    });

    console.log(`${formattedTime} [${source}] ${message}`);
}

app.use(
    express.json({
        limit: "25mb",
        verify: (req, _res, buf) => {
            req.rawBody = buf;
        },
    }),
);

app.use(express.urlencoded({ extended: false, limit: "25mb" }));

app.use((req, res, next) => {
    const start = Date.now();
    const path = req.path;
    let capturedJsonResponse: Record<string, any> | undefined = undefined;

    const originalResJson = res.json;
    res.json = function (bodyJson, ...args) {
        capturedJsonResponse = bodyJson;
        return originalResJson.apply(res, [bodyJson, ...args]);
    };

    res.on("finish", () => {
        const duration = Date.now() - start;
        if (path.startsWith("/api")) {
            let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
            if (capturedJsonResponse) {
                logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
            }

            log(logLine);
        }
    });

    next();
});

(async () => {
    const startupTimeout = setTimeout(() => {
        log("FATAL: Server startup timeout exceeded (120 seconds)");
        process.exit(1);
    }, 120000); // 120 second timeout

    try {
        log("=".repeat(50));
        log("Starting server...");
        log(`Environment: ${process.env.NODE_ENV || "development"}`);
        log(`Node version: ${process.version}`);
        log(`Platform: ${process.platform}`);
        log(`Working directory: ${process.cwd()}`);
        log("=".repeat(50));

        registerRoutes(httpServer, app);
        log("Routes registered successfully");

        app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
            const status = err.status || err.statusCode || 500;
            const message = err.message || "Internal Server Error";
            log(`Error: ${message} (${status})`);
            res.status(status).json({ message });
        });

        if (process.env.NODE_ENV === "production") {
            log("Setting up static file serving for production...");
            serveStatic(app);
            log("Static file serving configured");
        } else {
            log("Setting up Vite dev server...");
            const { setupVite } = await import("./vite");
            await setupVite(httpServer, app);
            log("Vite dev server configured");
        }

        const port = parseInt(process.env.PORT || "5000", 10);

        const server = httpServer.listen(port, "0.0.0.0", () => {
            clearTimeout(startupTimeout);
            log("=".repeat(50));
            log(`✓ Server is ready and listening on port ${port}`);
            log(`✓ Health check: http://0.0.0.0:${port}/health`);
            log("=".repeat(50));
        });

        // Set keep-alive on connections
        server.keepAliveTimeout = 65000;
        server.headersTimeout = 66000;

        server.on("error", (error: NodeJS.ErrnoException) => {
            clearTimeout(startupTimeout);
            if (error.code === "EADDRINUSE") {
                log(`FATAL: Port ${port} is already in use`);
            } else {
                log(`FATAL: Server error: ${error.message}`);
            }
            process.exit(1);
        });

        // Graceful shutdown handling
        process.on("SIGTERM", () => {
            log("SIGTERM signal received: closing server");
            clearTimeout(startupTimeout);
            server.close(() => {
                log("HTTP server closed");
                process.exit(0);
            });
        });

        process.on("SIGINT", () => {
            log("SIGINT signal received: closing server");
            clearTimeout(startupTimeout);
            server.close(() => {
                log("HTTP server closed");
                process.exit(0);
            });
        });

    } catch (error) {
        clearTimeout(startupTimeout);
        log(`FATAL ERROR during startup: ${error instanceof Error ? error.message : String(error)}`);
        console.error(error);
        process.exit(1);
    }
})();
