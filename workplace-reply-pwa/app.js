const $ = (selector) => document.querySelector(selector);

const scenarioMap = {
  reject: {
    name: "拒绝请求",
    goal: "守住边界",
    strategy: "先承接再转向",
    soft: "先接住对方需求，再说明自己当下无法承接，并给出可行替代。",
    opener: "我理解这件事对你来说比较急",
  },
  urge: {
    name: "催进度",
    goal: "推进交付",
    strategy: "明确节点",
    soft: "少评价对方，多聚焦时间点、影响面和下一步。",
    opener: "我想同步一下这个事项的进度",
  },
  feedback: {
    name: "反馈问题",
    goal: "解决问题",
    strategy: "事实先行",
    soft: "先讲观察到的事实，再讲影响，最后提出可执行调整。",
    opener: "我这边注意到一个需要一起确认的点",
  },
  boss: {
    name: "回复上级",
    goal: "稳住预期",
    strategy: "结论前置",
    soft: "先给结论，再给依据、风险和需要拍板的事项。",
    opener: "我先同步结论",
  },
  salary: {
    name: "谈薪加薪",
    goal: "争取资源",
    strategy: "价值对齐",
    soft: "把个人诉求放在贡献、职责变化和市场匹配里表达。",
    opener: "我想和您正式沟通一下薪酬和职责匹配的问题",
  },
  leave: {
    name: "请假调休",
    goal: "降低影响",
    strategy: "安排交代",
    soft: "表达请假需求时，同时说明交接安排和风险兜底。",
    opener: "我想申请一下时间安排上的调整",
  },
  apology: {
    name: "道歉修复",
    goal: "修复信任",
    strategy: "承担责任",
    soft: "不要急着解释，先承认影响，再补偿和给出改进。",
    opener: "这件事确实给你带来了影响",
  },
  boundary: {
    name: "表达边界",
    goal: "保护节奏",
    strategy: "温和设限",
    soft: "把边界说成工作安排和协作规则，而不是情绪对抗。",
    opener: "我想把这个协作边界提前说清楚",
  },
};

const channelMap = {
  feishu: {
    name: "飞书/IM",
    note: "适合工作群或私聊，保留清晰分段，方便对方快速抓重点。",
  },
  email: {
    name: "邮件",
    note: "适合正式沟通，补足称呼和收尾，语气更稳。",
  },
  wechat: {
    name: "微信",
    note: "适合轻量沟通，句子更短，减少正式感。",
  },
  meeting: {
    name: "会议口头",
    note: "适合会上表达，先给结论，再补背景和需要确认的动作。",
  },
};

const lengthMap = {
  short: {
    name: "简短",
    note: "压缩到最必要的信息，适合快速回复。",
  },
  standard: {
    name: "适中",
    note: "保留背景、边界和下一步，适合大多数职场场景。",
  },
  detailed: {
    name: "详细",
    note: "补充影响和诉求，适合敏感或需要留痕的沟通。",
  },
};

const state = {
  replies: [],
  prompt: "",
  riskSummary: "",
  latestScenario: "reject",
  latestSource: "template",
  history: JSON.parse(localStorage.getItem("workplaceReplyHistory") || "[]"),
  generationStats: JSON.parse(localStorage.getItem("workplaceReplyGenerationStats") || '{"minimax":0,"template":0}'),
  usageStats: JSON.parse(
    localStorage.getItem("workplaceReplyUsageStats") || '{"generate":0,"copy":0,"save":0,"refine":0,"scenarios":{}}',
  ),
  outcomeStats: JSON.parse(
    localStorage.getItem("workplaceReplyOutcomeStats")
      || '{"adopted":0,"followUp":0,"bySource":{"minimax":{"adopted":0,"followUp":0},"template":{"adopted":0,"followUp":0}},"recent":[]}',
  ),
};

const fields = {
  scenario: $("#scenario"),
  relationship: $("#relationship"),
  channel: $("#channel"),
  length: $("#length"),
  stakes: $("#stakes"),
  stakesValue: $("#stakesValue"),
  context: $("#context"),
  rawMessage: $("#rawMessage"),
  keepBoundary: $("#keepBoundary"),
  giveReason: $("#giveReason"),
  offerNext: $("#offerNext"),
  replyList: $("#replyList"),
  promptBox: $("#promptBox"),
  historyList: $("#historyList"),
  riskLabel: $("#riskLabel"),
  goalLabel: $("#goalLabel"),
  strategyLabel: $("#strategyLabel"),
  toast: $("#toast"),
  engineBadge: $("#engineBadge"),
  engineMessage: $("#engineMessage"),
  insightGrid: $("#insightGrid"),
  insightNote: $("#insightNote"),
  outcomeList: $("#outcomeList"),
  coachHeadline: $("#coachHeadline"),
  coachSummary: $("#coachSummary"),
};

function getTone() {
  return document.querySelector("input[name='tone']:checked")?.value || "温和";
}

function getForm() {
  return {
    scenario: fields.scenario.value,
    relationship: fields.relationship.value,
    channel: fields.channel.value,
    length: fields.length.value,
    tone: getTone(),
    stakes: Number(fields.stakes.value),
    context: fields.context.value.trim(),
    rawMessage: fields.rawMessage.value.trim(),
    keepBoundary: fields.keepBoundary.checked,
    giveReason: fields.giveReason.checked,
    offerNext: fields.offerNext.checked,
  };
}

function compactText(text, fallback) {
  return text.replace(/\s+/g, " ").trim() || fallback;
}

function trimEndPunctuation(text) {
  return text.replace(/[。！？!?；;，,、]+$/u, "");
}

function riskFromStakes(stakes) {
  if (stakes <= 2) return "低";
  if (stakes === 3) return "中";
  return "高";
}

function sentenceByTone(tone, form, scenario) {
  const target = form.relationship;
  const base = {
    温和: `${scenario.opener}，我也愿意配合把事情推进好。`,
    坚定: `${scenario.opener}，但我需要先把当前优先级和边界说明清楚。`,
    专业: `${scenario.opener}，我会从当前安排、影响和下一步三个部分说明。`,
    直接: `${scenario.opener}，我目前的判断是需要调整处理方式。`,
  };

  if (target === "上级") {
    base.直接 = "我先直接同步我的判断和当前限制。";
    base.坚定 = "我会尽量配合，但需要先确认优先级和取舍。";
  }

  if (target === "客户") {
    base.直接 = "我先同步当前可交付范围和后续安排。";
    base.坚定 = "为了保证交付质量，我需要先说明当前边界和时间安排。";
  }

  return base[tone] || base.温和;
}

function buildPieces(form, scenario) {
  const context = trimEndPunctuation(compactText(form.context, "目前这个事项和我的既有安排存在冲突"));
  const raw = trimEndPunctuation(compactText(form.rawMessage, "我需要更稳妥地表达自己的真实想法"));
  const reason = form.giveReason
    ? `原因是：${context}。`
    : "我先不展开太多原因，避免信息过载。";
  const boundary = form.keepBoundary
    ? "这部分我现在无法直接全部承接。"
    : "我可以尽量配合其中最关键的一部分。";
  const next = form.offerNext
    ? "如果可以，我们可以先确认优先级，我再按确认后的安排推进。"
    : "我先把这个判断同步给你。";

  return { context, raw, reason, boundary, next };
}

function linesByLength(coreLines, detailLines, form) {
  const lines = coreLines.filter(Boolean);
  if (form.length === "short") return lines.slice(0, 3);
  if (form.length === "detailed") {
    return [
      ...lines.slice(0, 2),
      ...detailLines.filter(Boolean),
      ...lines.slice(2),
    ];
  }
  return lines;
}

function formatForChannel(lines, form) {
  const compact = lines.filter(Boolean);

  if (form.channel === "email") {
    return ["您好，", ...compact, "", "谢谢。"].join("\n");
  }

  if (form.channel === "wechat") {
    return compact.join(" ");
  }

  if (form.channel === "meeting") {
    return ["我口头同步一下：", ...compact].join("\n");
  }

  return compact.join("\n");
}

function buildReply(coreLines, detailLines, form) {
  return formatForChannel(linesByLength(coreLines, detailLines, form), form);
}

function makeTemplateReplies(form) {
  const scenario = scenarioMap[form.scenario];
  const pieces = buildPieces(form, scenario);
  const opener = sentenceByTone(form.tone, form, scenario);
  const detailLines = [
    "影响是：如果不先确认边界，可能会影响当前安排或交付质量。",
    `我的原始诉求是：${pieces.raw}。`,
  ];

  const calibrated = buildReply([
    opener,
    pieces.reason,
    pieces.boundary,
    pieces.next,
  ], detailLines, form);

  const warm = buildReply([
    `${scenario.opener}，谢谢你先想到我。`,
    pieces.reason,
    form.keepBoundary ? "我担心如果现在硬接，反而会影响已有工作的质量。" : "我可以先帮你看最需要推进的部分。",
    form.offerNext ? "你看是否可以把最急的点发我，我今天先给你一个可行判断？" : "我先和你同步这个情况。",
  ], detailLines, form);

  const firm = buildReply([
    `${scenario.opener}，我需要先把边界说清楚。`,
    pieces.reason,
    form.keepBoundary ? "所以我这次不能直接接下完整事项。" : "我可以参与，但需要压缩范围。",
    form.offerNext ? "如果这个事项必须今天处理，建议先重新排优先级，或明确由谁主责推进。" : "这就是我当前能配合的范围。",
  ], detailLines, form);

  const executive = buildReply([
    "我先给结论：",
    scenario.name === "谈薪加薪"
      ? "我希望基于近期承担的职责和产出，正式讨论薪酬调整。"
      : `这个事项我建议按“${scenario.strategy}”处理。`,
    `背景：${pieces.context}。`,
    `我的原始诉求是：${pieces.raw}。`,
    form.offerNext ? "下一步：我们先确认优先级、负责人和时间点，我再继续推进。" : "以上是我当前判断。",
  ], [
    `风险：当前敏感度为${riskFromStakes(form.stakes)}，建议避免情绪化评价，只保留事实和动作。`,
  ], form);

  const channel = channelMap[form.channel];
  const length = lengthMap[form.length];

  const variants = [
    {
      title: `${form.tone}版 · ${channel.name} · ${length.name}`,
      body: calibrated,
      note: `${scenario.soft} ${channel.note} ${length.note}`,
    },
    {
      title: `缓和版 · ${channel.name}`,
      body: warm,
      note: `适合关系还不错、希望降低对抗感的场景。${channel.note}`,
    },
    {
      title: `${form.relationship === "上级" ? "汇报版" : "边界版"} · ${length.name}`,
      body: form.relationship === "上级" || form.relationship === "客户" ? executive : firm,
      note: form.relationship === "上级" || form.relationship === "客户"
        ? `适合需要更正式、更可追踪的沟通。${length.note}`
        : `适合多次被打断、需要把边界立住的场景。${length.note}`,
    },
  ];

  return variants;
}

function setGenerateLoading(loading) {
  const button = $("#generateButton");
  button.disabled = loading;
  button.textContent = loading ? "生成中..." : "生成 3 个版本";
}

function updateGenerationStatus(source, message) {
  fields.engineBadge.textContent = source === "minimax" ? "MiniMax 在线" : "本地模板";
  fields.engineBadge.dataset.source = source;
  fields.engineMessage.textContent = message;
}

function recordGeneration(source) {
  state.generationStats[source] = (state.generationStats[source] || 0) + 1;
  localStorage.setItem("workplaceReplyGenerationStats", JSON.stringify(state.generationStats));
  renderInsights();
}

function persistUsageStats() {
  localStorage.setItem("workplaceReplyUsageStats", JSON.stringify(state.usageStats));
}

function recordUsage(type, scenario) {
  state.usageStats[type] = (state.usageStats[type] || 0) + 1;
  if (scenario) {
    state.usageStats.scenarios[scenario] = (state.usageStats.scenarios[scenario] || 0) + 1;
  }
  persistUsageStats();
  renderInsights();
}

function getFallbackMessage(reason) {
  const messageMap = {
    empty_key_file: "服务端未读取到可用密钥，已自动切回本地模板。",
    json_without_supported_key_fields: "本地密钥文件格式不符合服务端读取规则，已使用本地模板。",
    key_file_format_not_supported: "本地密钥文件不是可直接使用的 API key，已使用本地模板。",
    key_file_unreadable: "服务端暂时无法读取密钥文件，已使用本地模板。",
    upstream_empty_content: "MiniMax 暂时没有返回可用正文，已自动切回本地模板。",
    upstream_network_error: "MiniMax 网络连接不稳定，已自动切回本地模板。",
    upstream_non_json_content: "模型返回格式不稳定，已自动切回本地模板。",
    upstream_reply_shape_invalid: "模型输出不满足可发送格式，已自动切回本地模板。",
    server_error: "生成服务暂时不可用，已使用本地模板兜底。",
  };

  if (messageMap[reason]) return messageMap[reason];

  if (reason?.startsWith("upstream_")) {
    return "MiniMax 服务调用失败，已自动切回本地模板。";
  }

  return "当前使用本地模板生成，适合快速出稿。";
}

async function requestGeneratedReplies(form, templateReplies) {
  const response = await fetch("./api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      form,
      prompt: buildPrompt(form),
      templateReplies,
    }),
  });

  if (!response.ok) {
    throw new Error(`request_${response.status}`);
  }

  return response.json();
}

function buildPrompt(form) {
  const scenario = scenarioMap[form.scenario];
  return [
    "你是一名擅长职场沟通、组织心理和中文表达的回复教练。",
    `场景：${scenario.name}`,
    `沟通对象：${form.relationship}`,
    `输出渠道：${channelMap[form.channel].name}`,
    `回复长度：${lengthMap[form.length].name}`,
    `目标语气：${form.tone}`,
    `敏感度：${form.stakes}/5`,
    `背景：${form.context || "未填写"}`,
    `我原本想说：${form.rawMessage || "未填写"}`,
    `要求：保留边界=${form.keepBoundary ? "是" : "否"}；给出理由=${form.giveReason ? "是" : "否"}；给下一步=${form.offerNext ? "是" : "否"}。`,
    "请输出：1. 温和版；2. 坚定版；3. 专业版；4. 风险提醒。每个版本控制在 120 字以内。",
  ].join("\n");
}

function getPreferredMaxLength(form) {
  if (form.channel === "email") return form.length === "detailed" ? 220 : 180;
  if (form.channel === "wechat") return form.length === "detailed" ? 140 : 110;
  if (form.channel === "meeting") return form.length === "detailed" ? 170 : 130;
  if (form.length === "short") return 90;
  if (form.length === "detailed") return 180;
  return 130;
}

function hasNextStep(body) {
  return /(确认|优先级|时间点|今天|明天|本周|安排|推进|同步|发我|回复我|下一步|交付|对齐)/u.test(body);
}

function hasBoundary(body) {
  return /(无法|不能|边界|范围|优先级|安排|暂时|先确认|先说明|当前限制)/u.test(body);
}

function analyzeReply(reply, form) {
  const issues = [];
  let score = 100;
  const lengthLimit = getPreferredMaxLength(form);
  const compactBody = reply.body.replace(/\s+/g, "");

  if (compactBody.length > lengthLimit) {
    issues.push(`偏长，建议控制在 ${lengthLimit} 字内`);
    score -= 16;
  }

  if (form.channel === "email" && !/^您好/u.test(reply.body)) {
    issues.push("邮件缺少称呼或收尾");
    score -= 18;
  }

  if (form.stakes >= 4 && /(立刻|马上|必须|别|真的没空|不要再)/u.test(reply.body)) {
    issues.push("高敏感场景下语气偏硬");
    score -= 18;
  }

  if (!hasNextStep(reply.body)) {
    issues.push("缺少明确下一步");
    score -= 14;
  }

  if (!hasBoundary(reply.body) && (form.scenario === "reject" || form.scenario === "boundary")) {
    issues.push("边界表达不够明确");
    score -= 14;
  }

  if (form.channel === "wechat" && reply.body.includes("\n")) {
    issues.push("微信场景可再压缩成更短句");
    score -= 8;
  }

  return {
    score: Math.max(52, score),
    issues,
    ready: issues.length <= 1,
  };
}

function buildCoachSummary(form) {
  const analyses = state.replies.map((reply) => analyzeReply(reply, form));
  if (!analyses.length) {
    fields.coachHeadline.textContent = "发送建议";
    fields.coachSummary.textContent = "系统会根据渠道、敏感度和措辞给出发送前建议。";
    return;
  }

  const bestScore = Math.max(...analyses.map((item) => item.score));
  const bestIndex = analyses.findIndex((item) => item.score === bestScore);
  const issueCounts = analyses.reduce((sum, item) => sum + item.issues.length, 0);
  const sourceLabel = state.latestSource === "minimax" ? "AI" : "模板";
  const riskSummary = state.riskSummary || `当前建议优先发送第 ${bestIndex + 1} 条，发送前重点检查下一步是否足够明确。`;

  fields.coachHeadline.textContent = `发送建议 · 推荐第 ${bestIndex + 1} 条`;
  fields.coachSummary.textContent = `${riskSummary} ${sourceLabel} 结果共识别 ${issueCounts} 个可优化点。`;
}

function renderReplies() {
  const form = getForm();
  const analyses = state.replies.map((reply) => analyzeReply(reply, form));
  const bestScore = analyses.length ? Math.max(...analyses.map((item) => item.score)) : 0;
  fields.replyList.innerHTML = "";
  state.replies.forEach((reply, index) => {
    const analysis = analyses[index];
    const article = document.createElement("article");
    article.className = "reply-card";
    article.innerHTML = `
      <header>
        <div class="reply-meta">
          <h3>${reply.title}</h3>
          <div class="reply-health">
            <span class="reply-score${analysis.score === bestScore ? " reply-score-best" : ""}">${analysis.score} 分</span>
            ${analysis.ready ? '<span class="reply-ready">可直接发送</span>' : ""}
          </div>
        </div>
        <div class="reply-actions">
          <button class="small-button" type="button" data-copy="${index}">复制</button>
          <button class="small-button" type="button" data-save="${index}">收藏</button>
        </div>
      </header>
      <p class="reply-body"></p>
      <div class="refine-actions" aria-label="快捷改写">
        <button class="chip-button chip-button-strong" type="button" data-polish="${index}">优化发送版</button>
        <button class="chip-button" type="button" data-refine="${index}" data-mode="shorten">收短</button>
        <button class="chip-button" type="button" data-refine="${index}" data-mode="soften">更温和</button>
        <button class="chip-button" type="button" data-refine="${index}" data-mode="firm">更坚定</button>
        <button class="chip-button" type="button" data-refine="${index}" data-mode="email">转邮件</button>
      </div>
      <div class="reply-checks"></div>
      <div class="outcome-actions" aria-label="结果反馈">
        <button class="chip-button chip-button-strong" type="button" data-outcome="${index}" data-status="adopted">已采用</button>
        <button class="chip-button" type="button" data-outcome="${index}" data-status="followUp">待跟进</button>
      </div>
      <div class="reply-note"></div>
    `;
    article.querySelector(".reply-body").textContent = reply.body;
    article.querySelector(".reply-note").textContent = reply.note;
    const checks = article.querySelector(".reply-checks");
    if (analysis.issues.length) {
      checks.innerHTML = analysis.issues.map((item) => `<span class="reply-check-pill">${item}</span>`).join("");
    } else {
      checks.innerHTML = '<span class="reply-check-pill reply-check-pass">结构完整，适合直接发送</span>';
    }
    fields.replyList.append(article);
  });
  buildCoachSummary(form);
}

function getTopScenarioLabel() {
  const entries = Object.entries(state.usageStats.scenarios || {});
  if (!entries.length) return "还没有形成稳定使用偏好";
  const [scenarioKey, count] = entries.sort((a, b) => b[1] - a[1])[0];
  return `高频场景：${scenarioMap[scenarioKey]?.name || scenarioKey}（${count} 次）`;
}

function renderInsights() {
  const totalOutcomes = (state.outcomeStats.adopted || 0) + (state.outcomeStats.followUp || 0);
  const adoptionRate = totalOutcomes ? `${Math.round(((state.outcomeStats.adopted || 0) / totalOutcomes) * 100)}%` : "0%";
  const minimaxStats = state.outcomeStats.bySource?.minimax || { adopted: 0, followUp: 0 };
  const templateStats = state.outcomeStats.bySource?.template || { adopted: 0, followUp: 0 };
  const winningSource = minimaxStats.adopted === 0 && templateStats.adopted === 0
    ? "暂无采用样本"
    : (minimaxStats.adopted >= templateStats.adopted ? "AI 更常被采用" : "模板更常被采用");
  const cards = [
    { label: "生成", value: state.usageStats.generate || 0 },
    { label: "复制", value: state.usageStats.copy || 0 },
    { label: "采用", value: state.outcomeStats.adopted || 0 },
    { label: "采用率", value: adoptionRate },
  ];

  fields.insightGrid.innerHTML = "";
  cards.forEach((card) => {
    const item = document.createElement("div");
    item.className = "insight-card";
    item.innerHTML = `<span>${card.label}</span><strong>${card.value}</strong>`;
    fields.insightGrid.append(item);
  });

  const sourceSummary = `AI ${state.generationStats.minimax || 0} 次 / 模板 ${state.generationStats.template || 0} 次`;
  fields.insightNote.textContent = `${getTopScenarioLabel()} · ${sourceSummary} · ${winningSource}`;
  renderOutcomeList();
}

function persistOutcomeStats() {
  localStorage.setItem("workplaceReplyOutcomeStats", JSON.stringify(state.outcomeStats));
}

function renderOutcomeList() {
  fields.outcomeList.innerHTML = "";
  const recent = Array.isArray(state.outcomeStats.recent) ? state.outcomeStats.recent.slice(0, 4) : [];

  if (!recent.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state outcome-empty";
    empty.textContent = "还没有记录采用结果";
    fields.outcomeList.append(empty);
    return;
  }

  recent.forEach((item) => {
    const row = document.createElement("div");
    row.className = "outcome-item";
    row.innerHTML = `
      <strong></strong>
      <span></span>
    `;
    row.querySelector("strong").textContent = `${item.status === "adopted" ? "已采用" : "待跟进"} · ${item.title}`;
    row.querySelector("span").textContent = `${scenarioMap[item.scenario]?.name || item.scenario} · ${item.source === "minimax" ? "AI" : "模板"}`;
    fields.outcomeList.append(row);
  });
}

function recordOutcome(reply, status) {
  if (!reply?.body || !status) return;

  state.outcomeStats[status] = (state.outcomeStats[status] || 0) + 1;
  if (!state.outcomeStats.bySource?.[state.latestSource]) {
    state.outcomeStats.bySource[state.latestSource] = { adopted: 0, followUp: 0 };
  }
  state.outcomeStats.bySource[state.latestSource][status] =
    (state.outcomeStats.bySource[state.latestSource][status] || 0) + 1;

  const recent = Array.isArray(state.outcomeStats.recent) ? state.outcomeStats.recent : [];
  state.outcomeStats.recent = [
    {
      title: reply.title,
      scenario: state.latestScenario,
      source: state.latestSource,
      status,
      recordedAt: new Date().toISOString(),
    },
    ...recent,
  ].slice(0, 12);

  persistOutcomeStats();
  renderInsights();
  showToast(status === "adopted" ? "已记为采用" : "已记为待跟进");
}

function renderHistory() {
  fields.historyList.innerHTML = "";
  if (!state.history.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "暂无收藏";
    fields.historyList.append(empty);
    return;
  }

  state.history.slice(0, 12).forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "history-item";
    row.innerHTML = `
      <div class="history-summary">
        <strong></strong>
        <span></span>
      </div>
      <div class="history-actions">
        <button class="small-button" type="button" data-history-use="${index}">回填</button>
        <button class="small-button" type="button" data-history-copy="${index}">复制</button>
      </div>
    `;
    row.querySelector("strong").textContent = item.title;
    row.querySelector("span").textContent = item.body;
    fields.historyList.append(row);
  });
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast("已复制");
  } catch {
    showToast("复制失败，请长按文本复制");
  }
}

function showToast(message) {
  fields.toast.textContent = message;
  fields.toast.classList.add("is-visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => fields.toast.classList.remove("is-visible"), 1700);
}

function saveReply(reply) {
  state.history = [
    { ...reply, savedAt: new Date().toISOString() },
    ...state.history.filter((item) => item.body !== reply.body),
  ].slice(0, 30);
  localStorage.setItem("workplaceReplyHistory", JSON.stringify(state.history));
  renderHistory();
  showToast("已收藏");
}

function splitReplyLines(body) {
  return body
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function ensureEnding(text) {
  return /[。！？!?]$/u.test(text) ? text : `${text}。`;
}

function softenSentence(text) {
  return ensureEnding(
    text
      .replace(/我需要/g, "我想先")
      .replace(/无法/g, "可能暂时没法")
      .replace(/不能/g, "这次可能不太适合直接")
      .replace(/必须/g, "最好先")
      .replace(/建议/g, "建议我们先")
      .replace(/我先给结论：?/g, "我先同步一下我的判断")
      .replace(/我先直接同步我的判断和当前限制/g, "我先和您同步一下我的判断，也说明当前限制"),
  );
}

function firmSentence(text) {
  return ensureEnding(
    text
      .replace(/我想先/g, "我需要先")
      .replace(/可能暂时没法/g, "现在无法")
      .replace(/不太适合直接/g, "不能直接")
      .replace(/建议我们先/g, "建议先")
      .replace(/如果可以，我们可以先确认优先级，我再按确认后的安排推进/g, "请先确认优先级和负责人，我再按确认后的安排推进")
      .replace(/谢谢你先想到我/g, "我先把当前边界说清楚"),
  );
}

function shortenReply(body) {
  const lines = splitReplyLines(body);
  if (lines.length <= 2) return body;
  const compact = lines.filter((line) => !/^影响是：|^我的原始诉求是：|^背景：/u.test(line));
  return compact.slice(0, Math.min(3, compact.length)).join("\n");
}

function formatAsEmail(body) {
  const lines = splitReplyLines(body);
  if (!lines.length) return body;
  const normalized = lines.join("\n");
  const withGreeting = normalized.startsWith("您好") ? normalized : `您好，\n${normalized}`;
  return /谢谢。?$/u.test(withGreeting) ? withGreeting : `${withGreeting}\n\n谢谢。`;
}

function refineReply(reply, mode) {
  if (!reply?.body) return reply;

  const lines = splitReplyLines(reply.body);
  let body = reply.body;
  let titleSuffix = "";
  let note = reply.note;

  if (mode === "shorten") {
    body = shortenReply(reply.body);
    titleSuffix = "收短";
    note = "已压缩到更适合即时发送的长度。";
  }

  if (mode === "soften") {
    body = lines.map(softenSentence).join("\n");
    titleSuffix = "更温和";
    note = "已降低冲突感，适合关系维护优先的场景。";
  }

  if (mode === "firm") {
    body = lines.map(firmSentence).join("\n");
    titleSuffix = "更坚定";
    note = "已强化边界和动作表达，适合需要立住预期的场景。";
  }

  if (mode === "email") {
    body = formatAsEmail(reply.body);
    titleSuffix = "邮件版";
    note = "已补足邮件常用称呼和收尾，可直接贴入邮件正文。";
  }

  return {
    ...reply,
    title: titleSuffix ? `${reply.title} · ${titleSuffix}` : reply.title,
    body,
    note,
  };
}

function addNextStep(body) {
  if (hasNextStep(body)) return body;
  return `${body}\n如果你确认优先级和时间点，我再按这个安排继续推进。`;
}

function polishReply(reply, form) {
  if (!reply?.body) return reply;

  let polished = { ...reply };
  const analysis = analyzeReply(polished, form);

  if (form.channel === "email" && !/^您好/u.test(polished.body)) {
    polished = refineReply(polished, "email");
  }

  if (analysis.issues.some((item) => item.includes("偏长"))) {
    polished = refineReply(polished, "shorten");
  }

  if (analysis.issues.some((item) => item.includes("语气偏硬"))) {
    polished = refineReply(polished, "soften");
  }

  polished.body = addNextStep(polished.body);

  if ((form.scenario === "reject" || form.scenario === "boundary") && !hasBoundary(polished.body)) {
    polished.body = `${polished.body}\n这部分我现在不能直接全部承接。`;
  }

  return {
    ...polished,
    title: `${reply.title} · 优化发送版`,
    note: "已根据渠道、敏感度和发送动作补齐可直接发送的关键结构。",
  };
}

function useHistoryReply(item) {
  state.replies = [{
    title: item.title,
    body: item.body,
    note: item.note || "来自收藏，可继续复制或重新收藏。",
  }];
  renderReplies();
  showToast("已回填到结果");
}

async function generate() {
  const form = getForm();
  const scenario = scenarioMap[form.scenario];
  const templateReplies = makeTemplateReplies(form);
  state.prompt = buildPrompt(form);
  state.latestScenario = form.scenario;

  fields.riskLabel.textContent = riskFromStakes(form.stakes);
  fields.goalLabel.textContent = scenario.goal;
  fields.strategyLabel.textContent = scenario.strategy;
  fields.promptBox.textContent = state.prompt;

  setGenerateLoading(true);
  recordUsage("generate", form.scenario);

  try {
    const result = await requestGeneratedReplies(form, templateReplies);
    const usingMiniMax = result.source === "minimax" && Array.isArray(result.replies) && result.replies.length;
    state.replies = usingMiniMax ? result.replies : templateReplies;
    state.riskSummary = typeof result.riskSummary === "string" ? result.riskSummary : "";
    state.latestSource = usingMiniMax ? "minimax" : "template";
    recordGeneration(usingMiniMax ? "minimax" : "template");
    updateGenerationStatus(
      usingMiniMax ? "minimax" : "template",
      usingMiniMax
        ? "当前优先使用服务端 MiniMax 生成，失败时会自动回退到本地模板。"
        : getFallbackMessage(result.fallbackReason),
    );
  } catch {
    state.replies = templateReplies;
    state.riskSummary = "";
    state.latestSource = "template";
    recordGeneration("template");
    updateGenerationStatus("template", "生成接口不可达，已直接使用本地模板。");
  } finally {
    setGenerateLoading(false);
    renderReplies();
  }
}

function setDateLabel() {
  const formatter = new Intl.DateTimeFormat("zh-CN", {
    month: "long",
    day: "numeric",
    weekday: "short",
  });
  $("#todayLabel").textContent = formatter.format(new Date());
}

function initTheme() {
  const saved = localStorage.getItem("workplaceReplyTheme");
  if (saved === "dark") document.documentElement.dataset.theme = "dark";
}

function bindEvents() {
  fields.stakes.addEventListener("input", () => {
    fields.stakesValue.textContent = fields.stakes.value;
  });

  $("#generateButton").addEventListener("click", () => {
    generate();
  });

  $("#clearButton").addEventListener("click", () => {
    fields.context.value = "";
    fields.rawMessage.value = "";
    generate();
  });

  $("#copyAllButton").addEventListener("click", () => {
    if (!state.replies.length) {
      generate().then(() => {
        copyText(state.replies.map((reply) => `${reply.title}\n${reply.body}`).join("\n\n"));
        recordUsage("copy");
      });
      return;
    }
    copyText(state.replies.map((reply) => `${reply.title}\n${reply.body}`).join("\n\n"));
    recordUsage("copy");
  });

  $("#promptToggle").addEventListener("click", () => {
    fields.promptBox.hidden = !fields.promptBox.hidden;
  });

  $("#clearHistoryButton").addEventListener("click", () => {
    state.history = [];
    localStorage.removeItem("workplaceReplyHistory");
    renderHistory();
    showToast("已清除");
  });

  $("#themeButton").addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next === "dark" ? "dark" : "";
    localStorage.setItem("workplaceReplyTheme", next);
  });

  fields.replyList.addEventListener("click", (event) => {
    const copyIndex = event.target.closest("[data-copy]")?.dataset.copy;
    const saveIndex = event.target.closest("[data-save]")?.dataset.save;
    const refineButton = event.target.closest("[data-refine]");
    const polishIndex = event.target.closest("[data-polish]")?.dataset.polish;
    const outcomeButton = event.target.closest("[data-outcome]");
    if (copyIndex !== undefined) {
      copyText(state.replies[Number(copyIndex)].body);
      recordUsage("copy");
    }
    if (saveIndex !== undefined) {
      saveReply(state.replies[Number(saveIndex)]);
      recordUsage("save");
    }
    if (refineButton) {
      const index = Number(refineButton.dataset.refine);
      const mode = refineButton.dataset.mode;
      state.replies[index] = refineReply(state.replies[index], mode);
      renderReplies();
      recordUsage("refine");
      showToast("已生成快捷改写版");
    }
    if (polishIndex !== undefined) {
      const index = Number(polishIndex);
      state.replies[index] = polishReply(state.replies[index], getForm());
      renderReplies();
      recordUsage("refine");
      showToast("已优化为更适合发送的版本");
    }
    if (outcomeButton) {
      const index = Number(outcomeButton.dataset.outcome);
      recordOutcome(state.replies[index], outcomeButton.dataset.status);
    }
  });

  fields.historyList.addEventListener("click", (event) => {
    const copyIndex = event.target.closest("[data-history-copy]")?.dataset.historyCopy;
    const useIndex = event.target.closest("[data-history-use]")?.dataset.historyUse;
    if (copyIndex !== undefined) {
      copyText(state.history[Number(copyIndex)].body);
      recordUsage("copy");
    }
    if (useIndex !== undefined) useHistoryReply(state.history[Number(useIndex)]);
  });
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}

initTheme();
setDateLabel();
bindEvents();
renderHistory();
renderInsights();
generate();
