import type { Lang } from './site';

export type WorkItem = {
  slug: string;
  index: string;
  status: Record<Lang, string>;
  title: Record<Lang, string>;
  summary: Record<Lang, string>;
  disciplines: Record<Lang, string[]>;
  question: Record<Lang, string>;
  context: Record<Lang, string>;
  approach: Record<Lang, { title: string; text: string }[]>;
  outcome: Record<Lang, string>;
  boundary: Record<Lang, string>;
};

export const workItems: WorkItem[] = [
  {
    slug: 'event-intelligence',
    index: '01',
    status: { zh: '实践方法', en: 'Applied method' },
    title: { zh: '工业事件智能：从单次故障到可复用知识', en: 'Industrial Event Intelligence' },
    summary: {
      zh: '将分散的工业事件按触发条件、技术链路、系统表现与控制点组织，建立可检索、可复盘的知识结构。',
      en: 'Structuring fragmented industrial events by trigger, technical chain, system behavior and control point to create reusable operational knowledge.',
    },
    disciplines: {
      zh: ['事件解码', 'MECE 分类', '知识工程'],
      en: ['Event analysis', 'MECE taxonomy', 'Knowledge engineering'],
    },
    question: {
      zh: '如何让第 N 个事件真正帮助第 N+1 个事件少走两步？',
      en: 'How can event N help the team take fewer wrong turns in event N+1?',
    },
    context: {
      zh: '工业现场的异常往往跨越环境、网络、控制逻辑、电气、计算基础设施与组织边界。只按工单关闭，经验会随对话消失；只按结果分类，又会掩盖真正的故障源。',
      en: 'Industrial incidents cross environmental, network, control, electrical, infrastructure and organizational boundaries. Closing tickets preserves activity, not learning; classifying by impact hides the dominant failure source.',
    },
    approach: {
      zh: [
        { title: '统一链路', text: '用“触发条件 → 异常机制 → 系统表现 → 业务影响 → 控制点”描述每个事件。' },
        { title: '主因分类', text: '按主导故障源进行 MECE 分类，同时保留证据状态与未验证假设。' },
        { title: '形成反馈', text: '把结论转化为检查清单、沟通边界和下一次处置的检索入口。' },
      ],
      en: [
        { title: 'Normalize the chain', text: 'Describe each event as trigger → mechanism → behavior → impact → control point.' },
        { title: 'Classify the dominant source', text: 'Use a MECE taxonomy while preserving evidence status and unverified hypotheses.' },
        { title: 'Close the feedback loop', text: 'Turn findings into checklists, decision boundaries and retrieval paths for the next event.' },
      ],
    },
    outcome: {
      zh: '形成一套从事件卡、检索索引到跨事件规律的三层知识结构。它不是替代工程判断的“自动答案”，而是让证据、边界与经验更快进入下一次判断。',
      en: 'A three-layer structure connects event cards, a retrieval index and cross-event patterns. It does not automate engineering judgment; it makes evidence, boundaries and prior learning available earlier.',
    },
    boundary: {
      zh: '本页仅展示匿名化方法。客户、装置、产品型号、时间与内部处置细节均不公开。',
      en: 'Only the anonymized method is shown. Customer, plant, product, timing and internal response details remain private.',
    },
  },
  {
    slug: 'reliable-industrial-ai',
    index: '02',
    status: { zh: '研究框架', en: 'Research framework' },
    title: { zh: '可靠工业 AI：从模型指标到运行边界', en: 'Reliable Industrial AI' },
    summary: {
      zh: '把数据质量、误报成本、人工确认、控制边界和反馈机制放进同一张工业 AI 决策图。',
      en: 'Bringing data quality, error cost, human confirmation, control boundaries and feedback into one Industrial AI decision map.',
    },
    disciplines: {
      zh: ['工业 AI', '可靠性', '人机协同'],
      en: ['Industrial AI', 'Reliability', 'Human-in-the-loop'],
    },
    question: {
      zh: '模型“准确”以后，为什么仍然可能无法进入真实生产？',
      en: 'Why can an accurate model still fail to enter real operations?',
    },
    context: {
      zh: '工业 AI 的失败通常不只来自算法。数据采集偏差、工况漂移、错误代价不对称、责任边界不清以及缺少回退路径，都会让一个离线表现良好的模型失去使用价值。',
      en: 'Industrial AI rarely fails on algorithms alone. Biased sensing, operating drift, asymmetric error costs, unclear ownership and missing fallback paths can make a strong offline model unusable.',
    },
    approach: {
      zh: [
        { title: '先定义决策', text: '明确模型影响哪个决策、由谁确认、错误动作会造成什么后果。' },
        { title: '再定义证据', text: '同时评估数据覆盖、漂移、可解释性和现场可验证信号。' },
        { title: '最后设计运行', text: '设置人工复核、降级策略、反馈标签与持续监测，而非直接闭环控制。' },
      ],
      en: [
        { title: 'Define the decision first', text: 'Specify what decision changes, who confirms it and what a wrong action costs.' },
        { title: 'Define the evidence', text: 'Evaluate coverage, drift, explainability and signals that can be verified on site.' },
        { title: 'Design for operation', text: 'Add human review, fallback, feedback labels and monitoring before any closed-loop control.' },
      ],
    },
    outcome: {
      zh: '输出一套用于评审预测维护、异常检测和知识助手方案的检查框架，使“能不能建模”转化为“能不能安全地产生价值”。',
      en: 'A review framework for predictive maintenance, anomaly detection and knowledge assistants—shifting the question from “can we model it?” to “can it create value safely?”',
    },
    boundary: {
      zh: '当前为研究框架，后续将通过公开工业数据集与可复现实验持续验证。',
      en: 'This is a research framework to be validated through reproducible experiments on public industrial datasets.',
    },
  },
  {
    slug: 'knowledge-asset-workflow',
    index: '03',
    status: { zh: '工作流原型', en: 'Workflow prototype' },
    title: { zh: 'AI 知识资产工作流：让记录进入下一次决策', en: 'AI Knowledge Asset Workflow' },
    summary: {
      zh: '把日志、事件和零散笔记转化为可追溯的概念、规则与行动模板，而不是继续堆积信息。',
      en: 'Turning logs, events and fragmented notes into traceable concepts, rules and action templates instead of accumulating more information.',
    },
    disciplines: {
      zh: ['Agent 工作流', '知识资产', '可追溯性'],
      en: ['Agent workflow', 'Knowledge assets', 'Traceability'],
    },
    question: {
      zh: 'AI 如何帮助人积累判断，而不只是生成更完整的摘要？',
      en: 'How can AI compound human judgment instead of producing more complete summaries?',
    },
    context: {
      zh: '记录如果不能进入检索、复盘和行动，会迅速变成信息负担。AI 若只负责总结，也容易制造“已经理解”的错觉。真正有价值的是可追溯的转换过程。',
      en: 'Notes that never enter retrieval, reflection or action quickly become a burden. AI-only summaries can also create an illusion of understanding. Value comes from a traceable transformation process.',
    },
    approach: {
      zh: [
        { title: '保留原始证据', text: '原始记录不被覆盖，所有概念和判断都能回到来源。' },
        { title: '分层提炼', text: '从事件提炼概念，从概念提炼规则，再连接到工作流和检查清单。' },
        { title: '由人做最终判断', text: 'AI 提议关联与结构，人确认语义、边界和下一步行动。' },
      ],
      en: [
        { title: 'Preserve source evidence', text: 'Raw records remain intact, so every concept and judgment can return to its source.' },
        { title: 'Distill in layers', text: 'Events become concepts; concepts become rules; rules connect to workflows and checklists.' },
        { title: 'Keep judgment human', text: 'AI proposes structure and links; a person confirms meaning, boundaries and action.' },
      ],
    },
    outcome: {
      zh: '形成一个面向长期学习的个人知识系统原型：输入不以“归档”为终点，而以是否改善下一次判断为评价标准。',
      en: 'A personal knowledge-system prototype for long-term learning, where input is judged by whether it improves the next decision—not whether it was archived.',
    },
    boundary: {
      zh: '这是个人工作流原型，不代表组织级知识治理方案；正式应用仍需权限、保密与质量控制设计。',
      en: 'This is a personal workflow prototype, not an enterprise knowledge-governance solution; deployment requires access, confidentiality and quality controls.',
    },
  },
];
