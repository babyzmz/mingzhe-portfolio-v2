"""Shared browser launch and page-loading helpers for portfolio browser tests.

Browser resolution (first match wins):
  1. PORTFOLIO_CHROMIUM_PATH, then CHROMIUM_PATH env var (explicit executable)
  2. PORTFOLIO_BROWSER_CHANNEL env ("chrome" or "msedge")
  3. Playwright-managed Chromium (python -m playwright install chromium)
  4. Well-known Chrome / Edge / Chromium install locations on Windows/macOS/Linux

Page loading:
  * PORTFOLIO_TEST_URL set -> real HTTP navigation with page.goto() and the URL
    is required to finish successfully. This is the acceptance path for the
    built site (dist/ or preview/ served over HTTP, including sub-paths).
  * Otherwise -> the standalone Mingzhe-Portfolio-Preview.html is injected with
    set_content(). That offline special case must NOT be reported as real-site
    HTTP acceptance.

Defaults are safe for a normal developer machine: headless new mode, no
--no-sandbox flag (set PORTFOLIO_BROWSER_ARGS to add arguments; semicolon
separated). Set PORTFOLIO_HEADED=1 for a visible window (used for GPU checks).
"""
from __future__ import annotations

import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
STANDALONE_HTML = ROOT / "Mingzhe-Portfolio-Preview.html"
OUTPUT_DIR = Path(os.environ.get("PORTFOLIO_TEST_OUTPUT", ROOT / "test-artifacts"))


def test_url() -> str | None:
    url = os.environ.get("PORTFOLIO_TEST_URL", "").strip()
    return url or None


def http_mode() -> bool:
    return test_url() is not None


def mode_label() -> str:
    return "HTTP " + test_url() if http_mode() else "OFFLINE set_content (standalone HTML)"


def _candidate_executables() -> list[str]:
    candidates = [
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
        os.path.expandvars(r"%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"),
        r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
        r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
        "/usr/bin/google-chrome",
        "/usr/bin/google-chrome-stable",
        "/usr/bin/chromium",
        "/usr/bin/chromium-browser",
        "/snap/bin/chromium",
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
        "/Applications/Chromium.app/Contents/MacOS/Chromium",
    ]
    return [p for p in candidates if p and Path(p).exists()]


def _playwright_chromium(pw) -> str | None:
    """Return Playwright-managed chromium executable if installed, else None."""
    try:
        exe = pw.chromium.executable_path
        return exe if exe and Path(exe).exists() else None
    except Exception:
        return None


def launch_browser(pw, extra_args: list[str] | None = None):
    """Launch a Chromium-family browser using env/configuration overrides.

    extra_args are appended after PORTFOLIO_BROWSER_ARGS for tests that need a
    specific browser capability (e.g. ['--disable-webgl'] to exercise the
    site's Canvas2D software-3D fallback deliberately).

    Returns (browser, info) where info describes how it was launched.
    """
    explicit = os.environ.get("PORTFOLIO_CHROMIUM_PATH") or os.environ.get("CHROMIUM_PATH")
    channel = os.environ.get("PORTFOLIO_BROWSER_CHANNEL", "").strip() or None
    extra_args = list(extra_args or [])
    env_args = [a for a in os.environ.get("PORTFOLIO_BROWSER_ARGS", "").split(";") if a.strip()]
    headed = os.environ.get("PORTFOLIO_HEADED", "").strip() in ("1", "true", "TRUE")
    launch_kwargs = {
        "headless": not headed,
        "args": env_args + extra_args,
    }
    if explicit:
        if not Path(explicit).exists():
            raise FileNotFoundError(f"PORTFOLIO_CHROMIUM_PATH/CHROMIUM_PATH not found: {explicit}")
        browser = pw.chromium.launch(executable_path=explicit, **launch_kwargs)
        info = {"source": "env-path", "executable": explicit, "channel": None, "headed": headed}
    elif channel:
        browser = pw.chromium.launch(channel=channel, **launch_kwargs)
        info = {"source": "channel", "executable": None, "channel": channel, "headed": headed}
    else:
        managed = _playwright_chromium(pw)
        if managed:
            browser = pw.chromium.launch(executable_path=managed, **launch_kwargs)
            info = {"source": "playwright-managed", "executable": managed, "channel": None, "headed": headed}
        else:
            found = _candidate_executables()
            if not found:
                raise RuntimeError(
                    "No Chromium-family browser found. Install Chrome/Edge, run "
                    "'python -m playwright install chromium', or set CHROMIUM_PATH."
                )
            browser = pw.chromium.launch(executable_path=found[0], **launch_kwargs)
            info = {"source": "well-known-path", "executable": found[0], "channel": None, "headed": headed}
    info["mode"] = mode_label()
    return browser, info


def load_page(page, wait_until: str = "load", settle_ms: int = 350):
    """Load the page under test: real HTTP goto when configured, else set_content."""
    url = test_url()
    if url:
        page.goto(url, wait_until=wait_until)
    else:
        page.set_content(STANDALONE_HTML.read_text(encoding="utf-8"), wait_until=wait_until)
    if settle_ms:
        page.wait_for_timeout(settle_ms)


def webgl_renderer(page) -> str:
    """Read the actual GL renderer string from an independent probe context."""
    return page.evaluate(
        """() => {
            try {
                const c = document.createElement('canvas');
                const gl = c.getContext('webgl2') || c.getContext('webgl');
                if (!gl) return 'no-webgl-context';
                const dbg = gl.getExtension('WEBGL_debug_renderer_info');
                return dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL))
                           : String(gl.getParameter(gl.RENDERER));
            } catch (e) { return 'probe-error: ' + e.message; }
        }"""
    )


def log_info(info: dict) -> None:
    for key in ("source", "executable", "channel", "mode", "headed"):
        if info.get(key) is not None:
            print(f"[browser-support] {key}: {info[key]}", flush=True)
