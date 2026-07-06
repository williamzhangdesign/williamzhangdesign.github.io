#!/usr/bin/env python3
"""Reskin a PageCrypt (maxlaumeister/pagecrypt.lupine.dev) output file to the
atelier portfolio look.

PageCrypt regenerates its stock lock screen every time you encrypt, so run
this after each re-encryption, before committing:

    python3 scripts/style-pagecrypt.py projects/incentives-referrals.html

Only the lock-screen chrome (title, CSS, dialog copy) is touched — element
IDs, classes, and the decryption script are preserved. Assumes the file
lives one level below the repo root (projects/) for the ../styles/ path.
"""
import re
import sys

CSS = """
        html, body {
            margin: 0;
            width: 100%;
            height: 100%;
            background: var(--ink, #0B0D12);
        }
        #contentFrame {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
        #dialogWrap {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: var(--font-sans, "Inter", system-ui, sans-serif);
            background:
                radial-gradient(ellipse 140% 90% at 50% 0%,
                    rgba(232, 212, 162, 0.05) 0%,
                    transparent 55%),
                var(--ink, #0B0D12);
        }
        #dialogWrapCell {
            width: 100%;
            display: flex;
            justify-content: center;
            padding: 24px;
            box-sizing: border-box;
        }
        #mainDialog {
            width: 100%;
            max-width: 420px;
            background: var(--ink-raised, #10131A);
            border: 1px solid var(--line-strong, rgba(242, 238, 228, 0.16));
            border-radius: 12px;
            overflow: hidden;
            text-align: left;
            box-shadow: 0 24px 64px rgba(0, 0, 0, 0.5);
        }
        #dialogText {
            padding: 30px 32px 0;
        }
        .lock-eyebrow {
            display: block;
            font-family: var(--font-mono, ui-monospace, monospace);
            font-size: 10px;
            font-weight: 500;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            color: var(--glow-soft, #C9B482);
            margin-bottom: 14px;
        }
        .lock-title {
            display: block;
            font-family: var(--font-display, Georgia, serif);
            font-weight: 300;
            font-size: 27px;
            line-height: 1.2;
            letter-spacing: -0.01em;
            color: var(--fg, #F2EEE4);
            margin-bottom: 10px;
        }
        .lock-title em {
            font-style: italic;
            color: var(--glow, #E8D4A2);
        }
        .lock-sub {
            display: block;
            font-size: 13px;
            line-height: 1.6;
            color: var(--fg-dim, #93918B);
        }
        .lock-sub a {
            color: var(--fg, #F2EEE4);
        }
        #passArea {
            padding: 6px 32px 28px;
        }
        #passwordPrompt {
            font-family: var(--font-mono, ui-monospace, monospace);
            font-size: 10px;
            font-weight: 500;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            color: var(--fg-dim, #93918B);
            margin: 18px 0 8px;
        }
        #pass {
            width: 100%;
            box-sizing: border-box;
            height: 46px;
            padding: 0 14px;
            font-size: 15px;
            font-family: inherit;
            color: var(--fg, #F2EEE4);
            background: var(--ink-deep, #070910);
            border: 1px solid var(--line-strong, rgba(242, 238, 228, 0.16));
            border-radius: 6px;
            outline: none;
            transition: border-color 200ms ease;
        }
        #pass:focus {
            border-color: var(--glow-deep, #6B5A3A);
        }
        #messageWrapper {
            float: left;
            vertical-align: middle;
            line-height: 34px;
            font-size: 12px;
        }
        .notifyText {
            display: none;
        }
        #invalidPass {
            color: #C97B7B;
        }
        #success {
            color: var(--glow, #E8D4A2);
        }
        #submitPass {
            float: right;
            margin-top: 6px;
            font-family: inherit;
            font-size: 12px;
            font-weight: 500;
            letter-spacing: 0.04em;
            color: var(--fg, #F2EEE4);
            background: transparent;
            border: 1px solid var(--line-strong, rgba(242, 238, 228, 0.16));
            border-radius: 999px;
            padding: 9px 22px;
            cursor: pointer;
            transition: color 200ms ease, border-color 200ms ease, background 200ms ease;
        }
        #submitPass:hover {
            color: var(--glow, #E8D4A2);
            border-color: var(--glow-deep, #6B5A3A);
            background: rgba(232, 212, 162, 0.12);
        }
        #submitPass:disabled {
            opacity: 0.45;
            cursor: default;
        }
        #securecontext, #nocrypto {
            padding: 0 32px 24px;
            font-size: 13px;
        }
        .error {
            display: none;
            color: #C97B7B;
        }
        #attribution {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            text-align: center;
            padding: 14px;
            font-family: var(--font-mono, ui-monospace, monospace);
            font-size: 10px;
            letter-spacing: 0.04em;
        }
        #attribution, #attribution a {
            color: var(--fg-faint, #4A4A48);
            border-bottom: none;
        }
    """

DIALOG_TEXT = """<div id="dialogText">
                    <span class="lock-eyebrow">wz &middot; confidential</span>
                    <span class="lock-title">This work is <em>protected.</em></span>
                    <span class="lock-sub">Enter the password to view. Don&rsquo;t have it?
                        <a href="mailto:whzhang@umich.edu">Request access</a>.</span>
                </div>"""


def patch(path):
    with open(path, encoding="utf-8-sig") as f:
        s = f.read()

    if "lock-eyebrow" in s:
        print(f"{path}: already styled, nothing to do")
        return

    n = 0

    s, k = re.subn(r"<title>.*?</title>",
                   "<title>Protected · William Zhang</title>", s, count=1)
    n += k

    # tokens.css supplies the font faces + custom properties
    s, k = re.subn(r"(<title>.*?</title>)",
                   r'\1\n    <link rel="stylesheet" href="../styles/tokens.css">',
                   s, count=1)
    n += k

    s, k = re.subn(r"<style>.*?</style>",
                   "<style>" + CSS + "</style>", s, count=1, flags=re.S)
    n += k

    s, k = re.subn(r'<div id="dialogText">.*?</div>', DIALOG_TEXT, s, count=1, flags=re.S)
    n += k

    for old, new in [
        ("Sorry, please try again.", "Incorrect password &mdash; try again."),
        ("Sorry, something went wrong.", "Something went wrong &mdash; refresh and retry."),
        (">Success!<", ">Unlocked.<"),
        (">Submit<", ">Unlock<"),
    ]:
        s, k = re.subn(re.escape(old), new, s, count=1)
        n += k

    assert n == 8, f"expected 8 patches, made {n} — pagecrypt template changed?"

    with open(path, "w", encoding="utf-8") as f:
        f.write(s)
    print(f"{path}: restyled ({n} patches)")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    patch(sys.argv[1])
