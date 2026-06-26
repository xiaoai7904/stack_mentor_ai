import { Injectable, NotFoundException } from "@nestjs/common";
import type {
  AnalyzeCallChainRequest,
  CallChainAnalysisResult,
} from "@stack-mentor/types";

const VUE_VERSION = "v3.5.38";
const VUE_COMMIT = "478e3e83acd34dd213a860be4a2a2bf2090dc26b";
const REPO = "vuejs/core";

const COUNT_VALUE_WATCH_RESULT: CallChainAnalysisResult = {
  snippet: `const count = ref(0)

watch(count, (newValue, oldValue) => {
  console.log(newValue, oldValue)
})

count.value++`,
  level: "intermediate",
  triggerStatement: "count.value++",
  visibleResult:
    "默认 flush: 'pre' 时，watch 回调不会在 setter 内同步执行；它会进入 scheduler 队列，并在当前同步代码结束后的微任务刷新阶段看到 newValue=1、oldValue=0。",
  summary:
    "count.value++ 会先读取 ref 的 value，再写回新值。写入 RefImpl.value 后，ref 自身的 Dep 触发订阅的 ReactiveEffect；watch 在运行时注入的 scheduler 将 job 放入队列，最终 job 重新执行 getter，比较新旧值后调用用户回调。",
  syncFlow: [
    "执行 count.value++，JavaScript 先读取 count.value，得到旧值 0。",
    "表达式计算出 1 后写回 count.value，进入 RefImpl 的 setter。",
    "setter 通过 hasChanged 判断新旧原始值不同，然后更新 _rawValue 与 _value。",
  ],
  reactiveFlow: [
    "watch(count, cb) 对 ref source 创建 getter：() => source.value。",
    "首次运行 getter 时，RefImpl.get value 通过 dep.track() 将 ReactiveEffect 订阅到该 ref。",
    "setter 更新值后调用 dep.trigger()，Dep.notify() 遍历订阅者并通知对应 effect。",
  ],
  schedulerFlow: [
    "ReactiveEffect.trigger() 发现 effect.scheduler 存在，因此调用 scheduler，而不是直接运行 effect。",
    "runtime-core 的 doWatch() 默认 flush 为 pre，非首次触发时调用 queueJob(job)。",
    "queueJob() 去重并安排 queueFlush()，flushJobs() 稍后执行 job。",
    "job 内部 effect.run() 重新取 count.value，比较 1 和 0 后调用用户传入的 watch 回调。",
  ],
  steps: [
    {
      id: "expression",
      title: "触发语句",
      category: "sync",
      sourceFile: "用户代码",
      sourceLines: "count.value++",
      summary: "读取旧值、计算新值、写回 ref。",
      detail:
        "这是 JavaScript 自增表达式自身的同步行为；Vue 的响应式逻辑从写回 .value 的 setter 开始介入。",
    },
    {
      id: "ref-setter",
      title: "RefImpl.set value",
      category: "reactivity",
      sourceFile: "packages/reactivity/src/ref.ts",
      sourceLines: "L142-L162",
      summary: "比较新旧值，更新 ref 内部状态并触发依赖。",
      detail:
        "setter 先拿 _rawValue 做变化判断，只有 hasChanged 为 true 时才更新 _rawValue/_value，并调用 this.dep.trigger()。",
    },
    {
      id: "dep-trigger",
      title: "Dep.trigger / notify",
      category: "reactivity",
      sourceFile: "packages/reactivity/src/dep.ts",
      sourceLines: "L167-L199",
      summary: "增加版本号，并通知订阅这个 ref 的 effect。",
      detail:
        "Dep.trigger() 更新 version/globalVersion 后进入 notify()。notify() 会批处理通知订阅者，watch 对应的 ReactiveEffect 是其中一个订阅者。",
    },
    {
      id: "effect-trigger",
      title: "ReactiveEffect.trigger",
      category: "reactivity",
      sourceFile: "packages/reactivity/src/effect.ts",
      sourceLines: "L206-L222",
      summary: "有 scheduler 时走调度器，没有 scheduler 才直接运行。",
      detail:
        "watch 创建的 effect 会被写入 scheduler，所以 ref 触发时不会直接调用用户回调，而是把执行权交给 watch 的调度策略。",
    },
    {
      id: "watch-job",
      title: "watch getter 与 job",
      category: "scheduler",
      sourceFile: "packages/reactivity/src/watch.ts",
      sourceLines: "L151-L156, L238-L292",
      summary: "getter 读取 ref，job 负责比较新旧值并调用回调。",
      detail:
        "source 是 ref 时，watch 使用 getter = () => source.value。job 里 effect.run() 得到 newValue，确认变化后传入 newValue、oldValue 和 cleanup 调用 cb。",
    },
    {
      id: "runtime-scheduler",
      title: "doWatch 注入 scheduler",
      category: "scheduler",
      sourceFile: "packages/runtime-core/src/apiWatch.ts",
      sourceLines: "L201-L211",
      summary: "默认 flush: 'pre' 时，非首次触发进入 queueJob。",
      detail:
        "runtime-core 的 doWatch() 把 scheduler 传给 reactivity 的 base watch。默认 pre 模式下首次运行同步执行，后续触发交给 queueJob(job)。",
    },
    {
      id: "queue-flush",
      title: "queueJob / flushJobs",
      category: "scheduler",
      sourceFile: "packages/runtime-core/src/scheduler.ts",
      sourceLines: "L99-L117, L214-L241",
      summary: "任务入队、去重，并在刷新阶段执行。",
      detail:
        "queueJob() 会避免重复入队并触发队列刷新；flushJobs() 遍历队列执行 job，因此用户回调发生在调度刷新阶段。",
    },
    {
      id: "callback",
      title: "用户可见结果",
      category: "result",
      sourceFile: "用户代码",
      sourceLines: "watch callback",
      summary: "回调收到 newValue=1、oldValue=0。",
      detail:
        "这是 watch job 重新执行 getter 并完成 hasChanged 比较后的结果。若配置 flush: 'sync'，调度时机不同；若写入相同值，则不会触发回调。",
    },
  ],
  edges: [
    { from: "expression", to: "ref-setter", label: ".value 写入" },
    { from: "ref-setter", to: "dep-trigger", label: "dep.trigger()" },
    { from: "dep-trigger", to: "effect-trigger", label: "通知 effect" },
    { from: "effect-trigger", to: "watch-job", label: "scheduler(job)" },
    { from: "watch-job", to: "runtime-scheduler", label: "默认 pre 调度" },
    { from: "runtime-scheduler", to: "queue-flush", label: "queueJob" },
    { from: "queue-flush", to: "callback", label: "执行 job" },
  ],
  sourceFiles: [
    {
      repository: REPO,
      filePath: "packages/reactivity/src/ref.ts",
      version: VUE_VERSION,
      commit: VUE_COMMIT,
      url: "https://github.com/vuejs/core/blob/v3.5.38/packages/reactivity/src/ref.ts#L142-L162",
      symbols: ["RefImpl.set value", "Dep.trigger"],
    },
    {
      repository: REPO,
      filePath: "packages/reactivity/src/dep.ts",
      version: VUE_VERSION,
      commit: VUE_COMMIT,
      url: "https://github.com/vuejs/core/blob/v3.5.38/packages/reactivity/src/dep.ts#L167-L199",
      symbols: ["Dep.trigger", "Dep.notify"],
    },
    {
      repository: REPO,
      filePath: "packages/reactivity/src/effect.ts",
      version: VUE_VERSION,
      commit: VUE_COMMIT,
      url: "https://github.com/vuejs/core/blob/v3.5.38/packages/reactivity/src/effect.ts#L206-L222",
      symbols: ["ReactiveEffect.trigger"],
    },
    {
      repository: REPO,
      filePath: "packages/reactivity/src/watch.ts",
      version: VUE_VERSION,
      commit: VUE_COMMIT,
      url: "https://github.com/vuejs/core/blob/v3.5.38/packages/reactivity/src/watch.ts#L238-L292",
      symbols: ["watch", "getter", "job", "ReactiveEffect"],
    },
    {
      repository: REPO,
      filePath: "packages/runtime-core/src/apiWatch.ts",
      version: VUE_VERSION,
      commit: VUE_COMMIT,
      url: "https://github.com/vuejs/core/blob/v3.5.38/packages/runtime-core/src/apiWatch.ts#L201-L211",
      symbols: ["doWatch", "baseWatchOptions.scheduler"],
    },
    {
      repository: REPO,
      filePath: "packages/runtime-core/src/scheduler.ts",
      version: VUE_VERSION,
      commit: VUE_COMMIT,
      url: "https://github.com/vuejs/core/blob/v3.5.38/packages/runtime-core/src/scheduler.ts#L99-L117",
      symbols: ["queueJob", "flushJobs"],
    },
  ],
  designMotivation:
    "Vue 把 ref 的值变化、依赖通知和 watch 回调调度拆开，是为了同时满足响应式准确性与渲染批处理。setter 只负责确认变化并通知依赖；effect 层决定是否直接运行；runtime scheduler 再把用户回调和组件更新放进可去重、可排序的任务队列。这样可以避免同一轮同步代码里频繁写值导致重复执行，也让 flush: 'pre'、'post'、'sync' 这类时机控制成为可能。",
  evidenceNotice:
    "源码路径、符号和行号基于 Vue core v3.5.38 tag 核对；设计动机部分是根据实现结构、调度策略和官方 watch 行为作出的解释性推断。",
};

@Injectable()
export class CallChainService {
  analyze(request: AnalyzeCallChainRequest): CallChainAnalysisResult {
    const normalizedSnippet = request.snippet.trim();
    const supportsCountValue =
      normalizedSnippet.includes("count.value++") ||
      normalizedSnippet.includes("count.value = count.value + 1");

    if (!supportsCountValue) {
      throw new NotFoundException(
        "当前 MVP 先支持 count.value++ 触发 watch 的调用链样例。",
      );
    }

    return {
      ...COUNT_VALUE_WATCH_RESULT,
      snippet: normalizedSnippet,
      level: request.level,
    };
  }
}
