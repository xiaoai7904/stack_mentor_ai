import type { ApiExplanation } from "@stack-mentor/types";

export const watchExplanation: ApiExplanation = {
  api: "watch",
  level: "intermediate",
  summary:
    "watch 用于显式监听一个或多个响应式数据源，并在值变化后执行带有新值、旧值和清理能力的回调。",
  signature: "watch(source, callback, options?): WatchHandle",
  parameters: [
    { name: "source", description: "ref、reactive 对象、getter，或数据源数组。" },
    {
      name: "callback",
      description: "变化后执行，接收 newValue、oldValue 和 onCleanup。",
    },
    {
      name: "options",
      description: "控制 immediate、deep、flush、once 等监听行为。",
    },
  ],
  returns: "返回 WatchHandle，可通过 stop、pause、resume 控制监听器。",
  useCases: [
    "状态变化后请求远程数据",
    "同步副作用到浏览器 API 或第三方库",
    "比较新旧值并清理过期异步任务",
  ],
  example: `import { ref, watch } from "vue"

const count = ref(0)

watch(count, (value, oldValue, onCleanup) => {
  const controller = new AbortController()
  onCleanup(() => controller.abort())
  console.log({ value, oldValue })
})

count.value++`,
  commonMistakes: [
    "直接传入 reactiveObject.count 会丢失响应式，应改为 () => reactiveObject.count。",
    "异步任务没有清理逻辑，可能产生竞态和过期结果。",
    "对大型对象无差别使用 deep: true，会增加遍历成本。",
  ],
  performanceNotes: [
    "优先监听精确 getter，避免不必要的深度监听。",
    "默认 flush: 'pre' 在组件更新前调度；读取更新后 DOM 时使用 'post'。",
    "flush: 'sync' 会跳过批处理保护，只适合明确的低频场景。",
  ],
  designMotivation:
    "watch 把依赖声明与副作用执行分开。调用者明确指出数据源，Vue 因而能够提供新旧值比较、调度时机和副作用清理。这种设计比自动追踪更适合可控、可取消的外部副作用。",
  sourceLocation: {
    filePath: "packages/reactivity/src/watch.ts",
    symbols: ["watch", "ReactiveEffect", "job"],
    readingOrder: [
      "packages/runtime-core/src/apiWatch.ts",
      "packages/reactivity/src/watch.ts",
      "packages/reactivity/src/effect.ts",
      "packages/runtime-core/src/scheduler.ts",
    ],
  },
  callChain: [
    "执行 getter，ReactiveEffect 收集依赖",
    "响应式 setter 调用 trigger",
    "依赖通知 effect scheduler",
    "scheduler 按 flush 策略安排 job",
    "job 比较新旧值并执行 cleanup 与 callback",
  ],
  relatedApis: ["watchEffect", "computed", "effectScope", "onWatcherCleanup"],
  references: [
    {
      title: "Vue 官方文档：watch()",
      sourceType: "official-doc",
      url: "https://vuejs.org/api/reactivity-core.html#watch",
      version: "Vue 3.5.38",
      symbol: "watch",
    },
    {
      title: "Vue 源码：reactivity/watch.ts",
      sourceType: "source-code",
      url: "https://github.com/vuejs/core/blob/v3.5.38/packages/reactivity/src/watch.ts",
      repository: "vuejs/core",
      filePath: "packages/reactivity/src/watch.ts",
      version: "v3.5.38",
      symbol: "watch",
    },
    {
      title: "Vue 源码：runtime-core/apiWatch.ts",
      sourceType: "source-code",
      url: "https://github.com/vuejs/core/blob/v3.5.38/packages/runtime-core/src/apiWatch.ts",
      repository: "vuejs/core",
      filePath: "packages/runtime-core/src/apiWatch.ts",
      version: "v3.5.38",
      symbol: "doWatch",
    },
  ],
  evidenceNotice:
    "当前为 Vue 3.5.38 可验证样例；正式知识库会进一步记录精确 commit。",
};
