#!/usr/bin/env node

import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const host = process.env.HOST || "127.0.0.1";
const port = Number(process.env.PORT || 57391);

const contentTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".md", "text/markdown; charset=utf-8"],
  [".svg", "image/svg+xml"],
]);

const server = createServer(async (request, response) => {
  if (!request.url || !["GET", "HEAD"].includes(request.method || "")) {
    response.writeHead(405, { Allow: "GET, HEAD" });
    response.end("Method not allowed");
    return;
  }

  const filePath = await resolveRequestPath(request.url);

  if (!filePath) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  const extension = path.extname(filePath);
  response.writeHead(200, {
    "Content-Type": contentTypes.get(extension) || "application/octet-stream",
  });

  if (request.method === "HEAD") {
    response.end();
    return;
  }

  createReadStream(filePath).pipe(response);
});

server.listen(port, host, () => {
  console.log(`Serving The Art of Intelligence at http://${host}:${port}/index.html`);
});

async function resolveRequestPath(url) {
  let pathname;

  try {
    pathname = decodeURIComponent(new URL(url, `http://${host}:${port}`).pathname);
  } catch {
    return null;
  }

  const requestedPath = pathname.endsWith("/") ? `${pathname}index.html` : pathname;
  const candidate = path.resolve(rootDir, `.${requestedPath}`);

  if (!isInsideRoot(candidate)) {
    return null;
  }

  const file = await resolveExistingFile(candidate);
  return file && isInsideRoot(file) ? file : null;
}

async function resolveExistingFile(candidate) {
  try {
    const details = await stat(candidate);

    if (details.isFile()) {
      return candidate;
    }

    if (details.isDirectory()) {
      const indexFile = path.join(candidate, "index.html");
      const indexDetails = await stat(indexFile);
      return indexDetails.isFile() ? indexFile : null;
    }
  } catch {
    return null;
  }

  return null;
}

function isInsideRoot(candidate) {
  const relative = path.relative(rootDir, candidate);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}
