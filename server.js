import http from "node:http";
import https from "node:https";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { FIREBASE_AUTH_DOMAIN } from "./src/firebase/domain.js";

const root = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(root, "dist");
const port = Number(process.env.PORT) || 8080;

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function send(res, status, body, type) {
  res.writeHead(status, { "content-type": type });
  res.end(body);
}

function proxyAuth(req, res) {
  const incoming = new URL(req.url, "http://127.0.0.1");
  const target = new URL(
    incoming.pathname + incoming.search,
    `https://${FIREBASE_AUTH_DOMAIN}`
  );
  const headers = { ...req.headers, host: target.host };
  delete headers.connection;
  delete headers["content-length"];

  const upstream = https.request(
    target,
    { method: req.method, headers },
    (up) => {
      res.writeHead(up.statusCode || 502, up.headers);
      up.pipe(res);
    }
  );
  upstream.on("error", () => {
    send(res, 502, "Auth handler unavailable", "text/plain; charset=utf-8");
  });
  req.pipe(upstream);
}

function fileFor(pathname) {
  let decoded = pathname;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return null;
  }
  const relative = path.normalize(decoded).replace(/^[/\\]+/, "");
  const full = path.resolve(dist, relative);
  if (full !== dist && !full.startsWith(dist + path.sep)) return null;
  return full;
}

function serveFile(res, filePath) {
  fs.readFile(filePath, (error, data) => {
    if (error) {
      send(res, 404, "Not found", "text/plain; charset=utf-8");
      return;
    }
    const ext = path.extname(filePath);
    const cache = ext === ".html" ? "no-cache" : "public, max-age=31536000, immutable";
    res.writeHead(200, {
      "content-type": types[ext] || "application/octet-stream",
      "cache-control": cache,
    });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  if (!req.url) {
    send(res, 400, "Bad request", "text/plain; charset=utf-8");
    return;
  }

  const pathname = new URL(req.url, "http://127.0.0.1").pathname;
  if (pathname === "/health") {
    send(res, 200, "ok", "text/plain; charset=utf-8");
    return;
  }
  if (pathname.startsWith("/__/auth/") || pathname.startsWith("/__/firebase/")) {
    proxyAuth(req, res);
    return;
  }

  const full = fileFor(pathname);
  if (!full) {
    send(res, 403, "Forbidden", "text/plain; charset=utf-8");
    return;
  }

  fs.stat(full, (error, stat) => {
    if (!error && stat.isFile()) {
      serveFile(res, full);
      return;
    }
    if (!error && stat.isDirectory()) {
      const index = path.join(full, "index.html");
      if (fs.existsSync(index)) {
        serveFile(res, index);
        return;
      }
    }
    serveFile(res, path.join(dist, "index.html"));
  });
});

server.listen(port, "0.0.0.0", () => {
  console.log(`CCC Meiran Central listening on ${port}`);
});
