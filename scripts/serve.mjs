#!/usr/bin/env node

import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const host = process.env.HOST || "127.0.0.1";
const hasExplicitPort = Boolean(process.env.PORT);
const requestedPort = hasExplicitPort ? parsePort(process.env.PORT) : 0;
let activePort = requestedPort;

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

await startServer();

async function resolveRequestPath(url) {
  let pathname;

  try {
    pathname = decodeURIComponent(new URL(url, `http://${host}:${activePort}`).pathname);
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

async function startServer() {
  try {
    await listen(requestedPort);
    activePort = getListeningPort();
    console.log(`Serving The Art of Intelligence at http://${host}:${activePort}/index.html`);
  } catch (error) {
    printListenFailure(requestedPort, error);
    process.exit(1);
  }
}

function listen(candidatePort) {
  return new Promise((resolve, reject) => {
    const handleError = (error) => {
      server.off("listening", handleListening);
      reject(error);
    };

    const handleListening = () => {
      server.off("error", handleError);
      resolve();
    };

    server.once("error", handleError);
    server.once("listening", handleListening);
    server.listen(candidatePort, host);
  });
}

function parsePort(value) {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 0 || parsed > 65535) {
    console.error(`Invalid PORT value: ${value}. Use a number from 0 to 65535.`);
    process.exit(1);
  }

  return parsed;
}

function printListenFailure(candidatePort, error) {
  const portLabel = candidatePort === 0 ? "an available local port" : `${host}:${candidatePort}`;

  if (error && error.code === "EACCES") {
    console.error(`Permission denied while trying to listen on ${portLabel}.`);
    return;
  }

  if (error && error.code === "EADDRINUSE") {
    console.error(`Port ${candidatePort} is already in use on ${host}. Try a different port, for example: PORT=8001 npm run serve`);
    return;
  }

  console.error(`Could not start the dev server on ${host}:${candidatePort}: ${error?.message || "unknown error"}`);
}

function getListeningPort() {
  const address = server.address();

  if (!address || typeof address === "string") {
    console.error("Could not determine the selected local port.");
    process.exit(1);
  }

  return address.port;
}
