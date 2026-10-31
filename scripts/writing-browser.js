const fs = require("fs");
const http = require("http");
const path = require("path");
const {chromium} = require("playwright");

async function launchBrowser() {
  const executable = process.env.WRITING_BROWSER_EXECUTABLE;
  if (executable) return chromium.launch({executablePath: executable});
  if (fs.existsSync(chromium.executablePath())) return chromium.launch();
  // Use an installed Chrome when Playwright's bundled browser is unavailable.
  return chromium.launch({channel: "chrome"});
}

async function serve(directory) {
  const root = path.resolve(directory);
  const types = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".json": "application/json",
    ".pdf": "application/pdf",
    ".png": "image/png",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".woff": "font/woff",
    ".ttf": "font/ttf"
  };
  const server = http.createServer((req, res) => {
    try {
      const requested = decodeURIComponent(
        new URL(req.url, "http://localhost").pathname
      );
      let target = path.resolve(root, `.${requested}`);
      if (target !== root && !target.startsWith(root + path.sep)) {
        res.writeHead(403).end();
        return;
      }
      if (fs.statSync(target).isDirectory())
        target = path.join(target, "index.html");
      res.setHeader(
        "Content-Type",
        types[path.extname(target)] || "application/octet-stream"
      );
      fs.createReadStream(target)
        .on("error", () => res.destroy())
        .pipe(res);
    } catch (error) {
      res.writeHead(404).end("Not found");
    }
  });
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  return {
    url: `http://127.0.0.1:${server.address().port}`,
    close: () => new Promise(resolve => server.close(resolve))
  };
}

module.exports = {launchBrowser, serve};
