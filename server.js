// Minimal static file server, so this site can be built and run as a container.
//
// Deliberately zero-dependency: package-lock.json declares no packages, and the
// build installs with `npm ci`, which fails if package.json asks for anything the
// lockfile doesn't already have. A dependency here (`serve`, `express`) would
// need the lockfile regenerated; the Node standard library does not.

const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = __dirname;
const PORT = Number(process.env.PORT) || 8080;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".zip": "application/zip",
  ".map": "application/json; charset=utf-8",
};

const server = http.createServer((req, res) => {
  // Strip the query string, then resolve inside ROOT. Anything that escapes the
  // root (../, encoded traversal) is refused rather than served.
  const url = decodeURIComponent((req.url || "/").split("?")[0]);
  const target = path.resolve(ROOT, "." + (url === "/" ? "/index.html" : url));

  if (target !== ROOT && !target.startsWith(ROOT + path.sep)) {
    res.writeHead(403, { "Content-Type": "text/plain" });
    return res.end("Forbidden");
  }

  fs.stat(target, (err, stat) => {
    // A directory serves its index.html; a miss falls back to the app shell so
    // client-side routes still load.
    const file = !err && stat.isDirectory() ? path.join(target, "index.html") : target;

    fs.readFile(file, (readErr, body) => {
      if (readErr) {
        return fs.readFile(path.join(ROOT, "index.html"), (shellErr, shell) => {
          if (shellErr) {
            res.writeHead(404, { "Content-Type": "text/plain" });
            return res.end("Not found");
          }
          res.writeHead(404, { "Content-Type": TYPES[".html"] });
          res.end(shell);
        });
      }
      res.writeHead(200, { "Content-Type": TYPES[path.extname(file).toLowerCase()] || "application/octet-stream" });
      res.end(body);
    });
  });
});

server.listen(PORT, () => {
  console.log(`serving ${ROOT} on :${PORT}`);
});
