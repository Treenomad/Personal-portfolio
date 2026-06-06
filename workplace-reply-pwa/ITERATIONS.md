# Iterations

## 2026-06-06

- Used the six-system scan to prioritize the send-confidence gap instead of adding more generation inputs: the main issue was that users could generate drafts but still lacked clear guidance on which one was safest to send.
- Added a send coach panel that surfaces the recommended version, the number of fixable issues, and the MiniMax `risk_summary` when AI is available.
- Added per-reply send scoring, issue tags, and a `可直接发送` state so the product now ranks outputs by task completion quality rather than showing three undifferentiated drafts.
- Added an `优化发送版` action that automatically fills missing next steps, normalizes email formatting, strengthens boundary wording when needed, and shortens copy when it is too long for the chosen channel.
- Kept the new send-check layer local-first: even if MiniMax is unavailable, the product can still audit and polish drafts with frontend heuristics and keep template fallback intact.
- Verified the local MiniMax key file is readable and usable by the backend without exposing plaintext; the app-owned `/api/generate` endpoint returned `source: minimax` using `https://api.minimaxi.com/v1`.
- Verified in the in-app browser that AI-generated replies now display send scores, the coach summary appears above the list, and clicking `优化发送版` on a weaker reply improved it from `72 分` to `100 分` with the status `结构完整，适合直接发送`.

## 2026-06-05

- Used the six-system scan to prioritize task completion over adding more generation controls: the main gap was no measurable link between generated replies and real adoption.
- Added per-reply outcome actions for `已采用` and `待跟进`, turning the product from a drafting tool into a lightweight completion tracker.
- Upgraded the local efficiency board to show adoption count, adoption rate, recent outcomes, and whether AI or template replies are more often accepted.
- Persisted outcome telemetry locally by scenario and source so later iterations can optimize for accepted replies instead of raw generation volume.
- Verified in the in-app browser that a generated reply can be marked `已采用`, the toast fires, and the board updates from `采用 0 / 采用率 0%` to `采用 1 / 采用率 100%`.
- Confirmed the MiniMax key file remains readable server-side, but live upstream verification was blocked in this run because outbound MiniMax requests timed out in the current environment; template fallback was verified through `/api/generate`.

- Added a second-pass MiniMax retry when the first upstream response is empty, non-JSON, or has an invalid reply shape.
- Tightened the retry prompt so MiniMax is asked again for a JSON object without Markdown, explanations, or extra text.
- Improved fallback copy so the UI can distinguish network instability, empty upstream content, and unstable model formatting.
- Bumped app asset versions and the service worker cache to ensure the browser loads the new retry-aware frontend.
- Verified five consecutive local `/api/generate` calls returned `source: minimax`, then refreshed the in-app browser and confirmed the UI reached `MiniMax 在线`.

## 2026-06-04

- Chose the highest-leverage iteration around post-generation task completion rather than adding more scenario inputs.
- Added per-reply quick rewrite actions for `收短`、`更温和`、`更坚定` and `转邮件`, so users can finish the last mile without leaving the app.
- Added a local efficiency board that tracks generate/copy/save/refine counts plus the user's most frequent scenario, giving the product a measurable optimization loop.
- Upgraded the MiniMax backend path to support official region fallback: the server now retries from `api.minimax.io` to `api.minimaxi.com` when the key is valid but bound to the China endpoint.
- Verified that the local MiniMax key file is readable and matches the server-side key rule; after region fallback, real AI generation can now succeed through the app-owned backend.
- Fixed insight refresh so AI/template usage counts update immediately after each generation.
- Hardened MiniMax response parsing so JSON wrapped in code fences or surrounding text can still be normalized into reply cards; verified `source: minimax` on the local API.

## 2026-06-03

- Added a local Node server with a first-party `/api/generate` endpoint so the app no longer depends on browser-side prompt generation alone.
- Implemented secure MiniMax key loading on the server only, with support for environment variables or a server-side file path.
- Updated the frontend to prefer the app-owned generation API and automatically fall back to local templates when AI is unavailable.
- Added explicit generation-source status in the UI so users know whether they are using MiniMax or offline templates.
- Bumped asset versions and the service worker cache so the new API-aware frontend and offline assets refresh cleanly.
- Added compatibility for the old `/workplace-reply-pwa/` local path so existing browser tabs can still load the new Node-backed app.
- Improved MiniMax fallback diagnostics so upstream account/auth failures are reported as explicit fallback reasons instead of empty-content failures.

## 2026-06-02

- Added channel controls for Feishu/IM, email, WeChat, and meeting-style replies.
- Added length controls for short, standard, and detailed replies.
- Updated the prompt drawer so copied prompts include channel and length requirements.
- Improved favorites with separate refill and copy actions.
- Normalized trailing punctuation in user input to avoid doubled sentence endings.
- Added versioned CSS/JS URLs and bumped the service worker cache version to refresh offline assets.
