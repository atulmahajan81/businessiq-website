"""Local dev server that mimics Cloudflare Pages URL handling.

Pages serves /foo from foo.html and /foo/bar from foo/bar.html, serves a
directory from its index.html without adding a trailing slash, and
308-redirects any .html URL to its extensionless form. Reproducing that
locally keeps previews honest about canonical URLs -- plain
`python -m http.server` does none of it, which is how a round of broken
canonicals previously reached production unnoticed.

Usage: python tools/serve.py <root-dir> [port]
"""
import os
import socketserver
import sys
from http.server import SimpleHTTPRequestHandler, HTTPServer

ROOT = sys.argv[1] if len(sys.argv) > 1 else "."
PORT = int(sys.argv[2]) if len(sys.argv) > 2 else 8765

os.chdir(ROOT)


class PagesHandler(SimpleHTTPRequestHandler):
    def send_head(self):
        path = self.path.split("?", 1)[0].split("#", 1)[0]

        if path.endswith(".html"):
            target = path[: -len(".html")]
            if target.endswith("/index"):
                target = target[: -len("/index")] or "/"
            self.send_response(308)
            self.send_header("Location", target)
            self.end_headers()
            return None

        if path not in ("/", "") and not path.endswith("/") and not os.path.splitext(path)[1]:
            rel = path.strip("/")
            if os.path.isfile(rel + ".html"):
                self.path = "/" + rel + ".html"
            elif os.path.isdir(rel):
                # Pages redirects a bare directory to its trailing-slash form
                # rather than serving index.html in place. Reproducing that is
                # the whole point of this server: a canonical pointing at the
                # slashless form would silently point at a redirect.
                self.send_response(308)
                self.send_header("Location", path + "/")
                self.end_headers()
                return None

        return super().send_head()

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def log_message(self, *a):
        pass


class ThreadedServer(socketserver.ThreadingMixIn, HTTPServer):
    daemon_threads = True
    allow_reuse_address = True


ThreadedServer(("127.0.0.1", PORT), PagesHandler).serve_forever()
