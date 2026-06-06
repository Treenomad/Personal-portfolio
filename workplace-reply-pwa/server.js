const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = Number(process.env.PORT || 5173);
const HOST = process.env.HOST || "127.0.0.1";
const ROOT = __dirname;
const LEGACY_BASE_PATH = "/workplace-reply-pwa";
const DEFAULT_KEY_PATH = "/Users/yuzhu/local-projects/minimax key.md";
const DEFAULT_MINIMAX_BASE_URL = "https://api.minimax.io/v1";
const CHINA_MINIMAX_BASE_URL = "https://api.minimaxi.com/v1";
const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
};

function sendJson(response, status, payload) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(JSON.stringify(payload));
}

function safeParseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function parseGeneratedJson(content) {
  const direct = safeParseJson(content);
  if (direct) return direct;

  const withoutFence = content
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/i, "")
    .trim();
  const unfenced = safeParseJson(withoutFence);
  if (unfenced) return unfenced;

  const start = content.indexOf("{");
  const end = content.lastIndexOf("}");
  if (start >= 0 && end > start) {
    return safeParseJson(content.slice(start, end + 1));
  }

  return null;
}

function extractKeyFromObject(object) {
  if (!object || typeof object !== "object") return "";
  const candidates = [
    "MINIMAX_API_KEY",
    "minimax_api_key",
    "api_key",
    "apiKey",
    "token",
    "secret_key",
    "secret",
    "key",
    "detail",
  ];
  for (const key of candidates) {
    const value = object[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

function looksLikeApiKey(value) {
  return /^[A-Za-z0-9._-]{8,}$/.test(value);
}

function readMiniMaxApiKey() {
  const direct = (process.env.MINIMAX_API_KEY || "").trim();
  if (looksLikeApiKey(direct)) {
    return { ok: true, key: direct, source: "env" };
  }

  const filePath = process.env.MINIMAX_API_KEY_FILE || DEFAULT_KEY_PATH;
  try {
    const raw = fs.readFileSync(filePath, "utf8").trim();
    if (!raw) return { ok: false, reason: "empty_key_file" };

    const parsed = safeParseJson(raw);
    if (parsed) {
      if (typeof parsed === "string" && looksLikeApiKey(parsed.trim())) {
        return { ok: true, key: parsed.trim(), source: "file_json_string" };
      }

      const objectKey = extractKeyFromObject(parsed);
      if (looksLikeApiKey(objectKey)) {
        return { ok: true, key: objectKey, source: "file_json" };
      }
      return { ok: false, reason: "json_without_supported_key_fields" };
    }

    if (looksLikeApiKey(raw)) {
      return { ok: true, key: raw, source: "file_text" };
    }

    return { ok: false, reason: "key_file_format_not_supported" };
  } catch {
    return { ok: false, reason: "key_file_unreadable" };
  }
}

function buildModelMessages(prompt, retryReason = "") {
  const retryInstruction = retryReason
    ? [
      "",
      "上一次输出没有被系统解析成功。",
      `失败原因：${retryReason}`,
      "这一次必须只返回一个 JSON 对象，不要返回解释、思考过程、Markdown、代码块或额外文本。",
    ].join("\n")
    : "";

  return [
    {
      role: "system",
      name: "Workplace Reply Coach",
      content: [
        "你是一名资深中文职场沟通教练。",
        "请基于用户表单生成可直接发送的职场回复。",
        "只输出 JSON，不要输出 Markdown 代码块或额外解释。",
        'JSON 格式必须为 {"replies":[{"title":"","body":"","note":""},{"title":"","body":"","note":""},{"title":"","body":"","note":""}],"risk_summary":""}。',
        "每条 body 控制在 60 到 180 字之间，必须可直接发送。",
        "note 用一句话说明适用场景。",
      ].join("\n"),
    },
    {
      role: "user",
      name: "user",
      content: `${prompt}${retryInstruction}`,
    },
  ];
}

function normalizeGeneratedPayload(payload) {
  const candidate = Array.isArray(payload) ? { replies: payload } : payload;
  const replies = Array.isArray(candidate?.replies) ? candidate.replies : [];
  const cleaned = replies
    .map((reply) => ({
      title: typeof reply?.title === "string" ? reply.title.trim() : "",
      body: typeof reply?.body === "string" ? reply.body.trim() : "",
      note: typeof reply?.note === "string" ? reply.note.trim() : "",
    }))
    .filter((reply) => reply.title && reply.body)
    .slice(0, 3);

  return {
    replies: cleaned,
    riskSummary: typeof candidate?.risk_summary === "string" ? candidate.risk_summary.trim() : "",
  };
}

function getMiniMaxBaseUrls() {
  const configured = (process.env.MINIMAX_BASE_URL || "").trim().replace(/\/+$/u, "");
  if (configured) return [configured];
  return [DEFAULT_MINIMAX_BASE_URL, CHINA_MINIMAX_BASE_URL];
}

async function requestMiniMax(baseUrl, apiKey, prompt, retryReason = "") {
  const upstream = await fetch(`${baseUrl}/text/chatcompletion_v2`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.MINIMAX_MODEL || "MiniMax-M2.7",
      temperature: 0.4,
      max_completion_tokens: 900,
      messages: buildModelMessages(prompt, retryReason),
    }),
  });

  const data = await upstream.json().catch(() => null);
  return {
    ok: upstream.ok,
    status: upstream.status,
    data,
    baseUrl,
  };
}

function shouldRetryMiniMax(result, baseUrl) {
  if (!result) return false;
  if (!baseUrl.includes("minimax.io")) return false;
  if (result.status === 401 || result.status === 403) return true;
  return result.data?.base_resp?.status_code === 2049;
}

async function callMiniMax(prompt) {
  const keyState = readMiniMaxApiKey();
  if (!keyState.ok) {
    return { ok: false, reason: keyState.reason };
  }

  const baseUrls = getMiniMaxBaseUrls();
  let lastFailure = { ok: false, reason: "upstream_unknown" };

  for (let index = 0; index < baseUrls.length; index += 1) {
    const baseUrl = baseUrls[index];
    let retryReason = "";

    for (let attempt = 1; attempt <= 2; attempt += 1) {
      let upstreamResult;
      try {
        upstreamResult = await requestMiniMax(baseUrl, keyState.key, prompt, retryReason);
      } catch {
        lastFailure = { ok: false, reason: "upstream_network_error" };
        retryReason = "network_error";
        continue;
      }

      if (!upstreamResult.ok) {
        lastFailure = { ok: false, reason: `upstream_${upstreamResult.status}` };
        if (!shouldRetryMiniMax(upstreamResult, baseUrl)) break;
        break;
      }

      const baseStatus = upstreamResult.data?.base_resp?.status_code;
      if (typeof baseStatus === "number" && baseStatus !== 0) {
        lastFailure = { ok: false, reason: `upstream_base_${baseStatus}` };
        if (!shouldRetryMiniMax(upstreamResult, baseUrl)) break;
        break;
      }

      const content = upstreamResult.data?.choices?.[0]?.message?.content;
      if (typeof content !== "string" || !content.trim()) {
        lastFailure = { ok: false, reason: "upstream_empty_content" };
        retryReason = "empty_content";
        continue;
      }

      const parsed = parseGeneratedJson(content);
      if (!parsed) {
        lastFailure = { ok: false, reason: "upstream_non_json_content" };
        retryReason = "non_json_content";
        continue;
      }

      const normalized = normalizeGeneratedPayload(parsed);
      if (normalized.replies.length < 3) {
        lastFailure = { ok: false, reason: "upstream_reply_shape_invalid" };
        retryReason = "reply_shape_invalid";
        continue;
      }

      return {
        ok: true,
        replies: normalized.replies,
        riskSummary: normalized.riskSummary,
        baseUrl,
        attempts: attempt,
      };
    }

    if (lastFailure.reason?.startsWith("upstream_base_2049")) continue;
  }

  return lastFailure;
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error("payload_too_large"));
        request.destroy();
      }
    });
    request.on("end", () => resolve(body));
    request.on("error", reject);
  });
}

function normalizePathname(pathname) {
  if (pathname === LEGACY_BASE_PATH) return "/";
  if (pathname.startsWith(`${LEGACY_BASE_PATH}/`)) {
    return pathname.slice(LEGACY_BASE_PATH.length) || "/";
  }
  return pathname;
}

function serveStatic(requestPath, response) {
  const cleanPath = requestPath === "/" ? "/index.html" : requestPath;
  const filePath = path.join(ROOT, decodeURIComponent(cleanPath));

  if (!filePath.startsWith(ROOT)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }

    const ext = path.extname(filePath);
    response.writeHead(200, {
      "Content-Type": MIME_TYPES[ext] || "application/octet-stream",
      "Cache-Control": ext === ".html" ? "no-cache" : "public, max-age=300",
    });
    response.end(data);
  });
}

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  const pathname = normalizePathname(url.pathname);

  if (request.method === "POST" && pathname === "/api/generate") {
    try {
      const rawBody = await readBody(request);
      const body = safeParseJson(rawBody) || {};
      const templateReplies = Array.isArray(body.templateReplies) ? body.templateReplies : [];
      const prompt = typeof body.prompt === "string" ? body.prompt : "";

      const result = await callMiniMax(prompt);
      if (result.ok) {
        sendJson(response, 200, {
          source: "minimax",
          replies: result.replies,
          riskSummary: result.riskSummary,
          baseUrl: result.baseUrl,
          attempts: result.attempts,
        });
        return;
      }

      sendJson(response, 200, {
        source: "template",
        replies: templateReplies,
        fallbackReason: result.reason,
      });
    } catch {
      sendJson(response, 500, {
        source: "template",
        replies: [],
        fallbackReason: "server_error",
      });
    }
    return;
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405);
    response.end("Method not allowed");
    return;
  }

  serveStatic(pathname, response);
});

server.listen(PORT, HOST, () => {
  console.log(`workplace-reply-pwa listening on http://${HOST}:${PORT}`);
});
