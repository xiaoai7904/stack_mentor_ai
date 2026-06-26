# Stack Mentor AI 计划清单

## MVP 目标

- [ ] 验证“AI + 框架源码学习”是否有真实需求。
- [ ] 聚焦 Vue3 源码知识库、AI 问答、API 解释器、源码定位、调用链分析。
- [ ] 先服务 JavaScript、TypeScript、Vue3、Vite，不提前扩展到 React/Node/企业版。

## 产品设计

- [ ] 明确用户分层：初级、中级、高级。
- [ ] 设计 API 解释器输出结构。
- [x] 设计源码阅读助手输出结构。
- [x] 设计调用链分析输出结构。
- [x] 设计知识图谱节点和边类型。
- [ ] 设计 Event Loop / 响应式 / HMR 可视化执行流程。
- [ ] 设计 AI 面试官评分规则。
- [ ] 设计免费版、Pro 版、企业版能力边界。

## 前端 MVP

- [x] 使用 PNPM 初始化 monorepo 项目。
- [x] 创建 `pnpm-workspace.yaml`。
- [x] 建立基础目录：`apps/web`、`apps/api`、`packages/ui`、`packages/hooks`、`packages/prompts`、`packages/rag`、`packages/types`。
- [x] 初始化 Vue3 + Vite@8+ + TypeScript 前端应用，并使用最新稳定版本。
- [x] 接入 PrimeVue 作为前端 UI 组件库。
- [x] 配置 TailwindCSS v4+。
- [x] 接入 Vue Bits 作为页面动画和交互动效方案。
- [x] 接入 Monaco Editor。
- [x] 建立页面与逻辑分层规范：页面只做布局组合，复杂逻辑抽到 hook。
- [x] 创建核心 hooks：`useApiExplainer`、`useSourceReader`、`useCallChainAnalysis`、`useKnowledgeGraph`。
- [x] 实现首页工作台。
- [x] 实现 API 解释器页面。
- [x] 实现源码阅读助手页面。
- [x] 实现调用链分析页面。
- [x] 实现知识图谱页面，优先 Vue Flow 或 AntV G6。
- [ ] 实现 AI 实验室基础代码运行区。
- [x] 实现响应式布局和加载/错误/空状态。

## 后端 MVP

- [x] 选定后端技术栈：Node.js + NestJS + Fastify。
- [x] 将后端服务放入 monorepo 的 `apps/api`。
- [x] 配置 NestJS Fastify 适配器。
- [x] 设计统一 LLM Provider 接口。
- [ ] 接入至少一个模型供应商。
- [x] 设计 Prompt Template 管理方式。
- [x] 实现 API 解释接口。
- [x] 实现源码定位接口。
- [x] 实现调用链分析接口。
- [ ] 实现问答会话存储。
- [ ] 增加请求日志、错误日志和超时控制。

## RAG 与数据处理

- [ ] 确定首批知识源：Vue Docs、Vue RFC、Vue 源码。
- [ ] 拉取源码仓库并记录版本和 commit。
- [ ] 设计源码解析策略，保留文件路径、包名、导出符号、函数名、类名。
- [ ] 设计文档 chunk 策略。
- [ ] 设计源码 chunk 策略，避免只按固定长度切分。
- [ ] 选择向量数据库：Qdrant、Milvus 或 pgvector。
- [ ] 实现 embedding 入库流程。
- [ ] 实现检索、重排和上下文拼接。
- [ ] 回答中展示引用来源。
- [ ] 对“证据不足”的场景做明确提示。

## 部署策略

- [ ] MVP 前期优先使用免费部署方案验证产品价值，避免过早投入固定服务器成本。
- [ ] 前端 `apps/web` 优先部署到 Cloudflare Pages，备选 Vercel Hobby。
- [ ] 后端 `apps/api` 前期可部署到 Vercel Hobby、Render Free 或同类可运行 Node.js API 的免费平台。
- [ ] 向量数据库前期优先使用 Qdrant Cloud Free，备选 Supabase pgvector 或 Neon pgvector。
- [ ] 会话、用户数据和问答记录前期优先使用 Supabase Free 或 Neon Free，不依赖后端本地文件持久化。
- [ ] Vue Docs、Vue RFC、Vue 源码的解析、chunk、embedding 入库流程作为离线任务执行，前期可在本地或 GitHub Actions 中运行。
- [ ] 免费部署阶段不在请求接口中执行批量源码解析、批量 embedding、全量索引重建等长任务。
- [ ] 所有部署相关配置必须通过环境变量注入，例如 `DATABASE_URL`、`QDRANT_URL`、`QDRANT_API_KEY`、`LLM_PROVIDER`、`OPENAI_API_KEY`、`APP_ORIGIN`、`REQUEST_TIMEOUT_MS`。
- [ ] 后端保持无状态设计，不能依赖进程内存保存会话、检索上下文、用户状态或任务进度。
- [ ] NestJS 服务需要预留两类启动入口：传统 Node.js 常驻服务入口和 Serverless 部署入口。
- [ ] RAG、Prompt、LLM Provider、引用拼接等核心能力必须放在 `packages/*` 或独立 service 中，不能绑定 Vercel、Cloudflare、Render 等特定平台 API。
- [ ] 后期迁移到付费服务器时，优先保持业务代码不变，仅替换部署入口、环境变量、数据库地址、向量库地址和 CI/CD 配置。

## 质量验证

- [x] 检查依赖安装、脚本运行和 workspace 管理都使用 PNPM。
- [x] 检查项目符合 monorepo 分层，前端、后端、共享包职责清晰。
- [x] 检查前端 UI 组件统一使用 PrimeVue。
- [x] 检查 CSS 使用 TailwindCSS v4+。
- [x] 检查页面动画效果使用 Vue Bits。
- [x] 检查 NestJS 服务使用 Fastify 适配器。
- [x] 检查前端页面没有承载复杂业务逻辑，核心逻辑已抽成 hook。
- [ ] 准备 API 解释器样例：`watch`、`ref`、`computed`、`reactive`。
- [ ] 准备源码阅读样例：Vue3 ref 原理、computed 原理、watch 调度。
- [x] 准备调用链样例：`count.value++` 触发 watch。
- [x] 检查源码路径是否准确。
- [x] 检查回答是否区分事实和推断。
- [ ] 检查初级/中级/高级答案是否有明显层次。
- [x] 检查 UI 是否能承载长文本、代码块、图谱和引用。
- [ ] 检查前期免费部署方案可运行：前端静态部署、后端 API 部署、向量库连接、数据库连接、模型 Provider 调用。
- [ ] 检查后端没有依赖本地磁盘、进程内存或平台私有能力保存核心业务状态。
- [ ] 检查长任务已从在线请求中拆出，可通过本地脚本、GitHub Actions 或后续 worker 执行。
- [ ] 检查后期迁移到付费服务器时不需要重写核心业务代码。

## 第二阶段

- [ ] 扩展 React、Next.js、Zustand、Redux。
- [ ] 扩展 Node.js、Express、NestJS。
- [ ] 扩展 Webpack、Rollup、Vite 工程化专题。
- [ ] 扩展 DOM、BOM、浏览器渲染原理。

## 第三阶段

- [ ] 实现源码阅读路径推荐。
- [ ] 实现按用户水平生成 AI 学习地图。
- [ ] 实现 AI 课程生成：学习计划、每日任务、源码练习题、面试题。
- [ ] 支持团队知识库和内部框架培训。

## 执行记录

### 2026-06-25：源码阅读助手纵向闭环

- [x] 核对 Vue `v3.5.38` 的 `packages/reactivity/src/ref.ts`，记录 tag commit `478e3e83acd34dd213a860be4a2a2bf2090dc26b`。
- [x] 新增 `SourceReadingResult` 和 `LocateSourceRequest` 共享类型。
- [x] 新增 NestJS `POST /api/source/locate` 源码定位接口。
- [x] 实现 `useSourceReader`，包含加载、错误、取消请求和学习层级状态。
- [x] 接入 Monaco Editor，只读展示 Vue 源码并支持按关键符号跳转。
- [x] 实现源码入口、关键符号、设计动机、调用链、阅读顺序、前置知识、练习和引用来源。
- [x] 源码摘录使用连续的 59–165 行，确保编辑器行号与官方源码一致。
- [x] 源码阅读页采用路由懒加载，避免 Monaco 进入首页主包。
- [x] 修复 Vite `/api` 代理误匹配 `/api-explainer` 前端路由的问题。
- [x] 完成桌面与 390px 移动端验证，无横向溢出，浏览器控制台无错误。

### 2026-06-26：调用链分析纵向闭环

- [x] 核对 Vue `v3.5.38` 调用链相关源码位置：`ref.ts`、`dep.ts`、`effect.ts`、`watch.ts`、`apiWatch.ts`、`scheduler.ts`。
- [x] 新增 `AnalyzeCallChainRequest`、`CallChainAnalysisResult`、`CallChainStep` 和 `CallChainEdge` 共享类型。
- [x] 新增 NestJS `POST /api/call-chain/analyze` 调用链分析接口。
- [x] 实现 `count.value++` 触发 `watch` 的 MVP 样例，明确区分同步流程、响应式触发、异步调度和用户可见结果。
- [x] 新增 `useCallChainAnalysis`，包含加载、错误、取消请求和学习层级状态。
- [x] 实现调用链分析页面，包含代码输入、链路图、三段流程解释、关键节点和源码引用。
- [x] 路由 `/call-chain` 从占位页切换为懒加载真实页面。
- [x] 完成 `pnpm build` 验证；Monaco 懒加载 chunk 仍有 Vite 大文件警告，当前不影响调用链页面。
- [x] 完成接口样例验证，返回 `advanced` 层级、8 个调用链节点和 6 个源码文件引用。

### 2026-06-26：知识图谱纵向闭环

- [x] 使用 PNPM 为前端接入 `@vue-flow/core`，满足图谱优先使用 Vue Flow 的约束。
- [x] 核对 Vue `v3.5.38` 的 `computed.ts`、`effect.ts`、`dep.ts`、`ref.ts`、`baseHandlers.ts` 相关源码位置。
- [x] 新增 `KnowledgeGraphNode`、`KnowledgeGraphEdge`、`KnowledgeGraphResult` 和 `QueryKnowledgeGraphRequest` 共享类型。
- [x] 新增 NestJS `POST /api/knowledge-graph/query` 知识图谱查询接口。
- [x] 实现 `computed` MVP 图谱样例，包含核心节点、直接依赖、反向依赖、数据流、阅读路径和引用来源。
- [x] 新增 `useKnowledgeGraph`，包含加载、错误、取消请求、节点选择和学习层级状态。
- [x] 实现知识图谱页面，包含 Vue Flow 画布、节点详情、阅读路径、依赖列表、数据流和证据区。
- [x] 路由 `/knowledge-graph` 从占位页切换为懒加载真实页面。
- [x] 完成 `pnpm build` 验证；知识图谱页面已单独拆分为懒加载 chunk。
- [x] 完成接口样例验证，返回 `advanced` 层级、10 个图谱节点、11 条关系边和 4 个引用来源。
