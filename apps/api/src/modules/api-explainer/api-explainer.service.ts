import { Injectable, NotFoundException } from "@nestjs/common";
import type {
  ApiExplanation,
  ExplainApiRequest,
} from "@stack-mentor/types";

const WATCH_EXPLANATION: ApiExplanation = {
  api: "watch",
  level: "intermediate",
  summary:
    "watch 用于显式监听一个或多个响应式数据源，并在值变化后执行带有新值、旧值和清理能力的回调。",
  signature:
    "watch(source, callback, options?): WatchHandle",
  parameters: [
    {
      name: "source",
      description: "ref、reactive 对象、getter，或这些数据源组成的数组。",
    },
    {
      name: "callback",
      description: "数据变化后执行，接收 newValue、oldValue 和 onCleanup。",
    },
    {
      name: "options",
      description: "控制 immediate、deep、flush、once 等监听行为。",
    },
  ],
  returns: "返回 WatchHandle，可调用 stop、pause 和 resume 控制监听器。",
  useCases: [
    "响应式状态变化后请求远程数据",
    "同步副作用到浏览器 API 或第三方库",
    "需要比较新旧值，或清理过期异步任务",
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
    "直接传入 reactiveObject.count 会丢失响应式，应改为 getter：() => reactiveObject.count。",
    "在回调内启动异步任务却不注册清理逻辑，可能产生竞态和过期结果。",
    "无必要地使用 deep: true 会遍历嵌套属性，增加更新成本。",
  ],
  performanceNotes: [
    "优先监听精确 getter，避免对大型对象进行深度监听。",
    "默认 flush: 'pre' 会在组件更新前调度回调；读取更新后的 DOM 时使用 flush: 'post'。",
    "同步监听会跳过批处理保护，应谨慎使用 flush: 'sync'。",
  ],
  designMotivation:
    "watch 将依赖收集和副作用执行分离：数据源由调用者明确声明，回调只在变化时运行。这使新旧值比较、调度时机和副作用清理都能被精确控制，适合处理有状态的外部副作用。",
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
    "创建 ReactiveEffect 并执行 getter 收集依赖",
    "响应式 setter 调用 trigger",
    "依赖通知触发 effect scheduler",
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
      symbol: "watch",
      version: "v3.5.38",
    },
    {
      title: "Vue 源码：runtime-core/apiWatch.ts",
      sourceType: "source-code",
      url: "https://github.com/vuejs/core/blob/v3.5.38/packages/runtime-core/src/apiWatch.ts",
      repository: "vuejs/core",
      filePath: "packages/runtime-core/src/apiWatch.ts",
      symbol: "doWatch",
      version: "v3.5.38",
    },
  ],
  evidenceNotice:
    "当前为 Vue 3.5.38 可验证样例；正式知识库会进一步记录精确 commit。",
};

@Injectable()
export class ApiExplainerService {
  explain(request: ExplainApiRequest): ApiExplanation {
    if (request.api.toLowerCase() !== "watch") {
      throw new NotFoundException(
        `首版内置样例仅支持 watch，${request.api} 需要接入知识库后检索。`,
      );
    }

    return {
      ...WATCH_EXPLANATION,
      level: request.level,
    };
  }
}
