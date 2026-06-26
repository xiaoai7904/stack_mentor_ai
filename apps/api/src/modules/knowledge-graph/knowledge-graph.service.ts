import { Injectable, NotFoundException } from "@nestjs/common";
import type {
  KnowledgeGraphResult,
  QueryKnowledgeGraphRequest,
  SourceReference,
} from "@stack-mentor/types";

const VUE_VERSION = "v3.5.38";
const VUE_COMMIT = "478e3e83acd34dd213a860be4a2a2bf2090dc26b";
const REPO = "vuejs/core";

function sourceReference(
  title: string,
  filePath: string,
  symbol: string,
  lineHash = "",
): SourceReference {
  return {
    title,
    sourceType: "source-code",
    url: `https://github.com/vuejs/core/blob/${VUE_VERSION}/${filePath}${lineHash}`,
    repository: REPO,
    filePath,
    version: VUE_VERSION,
    commit: VUE_COMMIT,
    symbol,
  };
}

const COMPUTED_GRAPH: KnowledgeGraphResult = {
  concept: "computed",
  level: "intermediate",
  summary:
    "computed 是带缓存的派生状态节点。它用 ComputedRefImpl 保存 getter、dep 和脏标记；读取 computed.value 时收集外层订阅者并通过 refreshComputed() 按需重新计算；底层依赖变化时先让 computed 失效，再通知读取它的订阅者。",
  coreNodeId: "computed-api",
  nodes: [
    {
      id: "computed-api",
      label: "computed()",
      kind: "api",
      summary: "公共 API，根据 getter 或 get/set 选项创建 ComputedRefImpl。",
      source: sourceReference(
        "Vue 3.5.38 源码：computed()",
        "packages/reactivity/src/computed.ts",
        "computed",
        "#L189-L221",
      ),
      metadata: {
        packageName: "@vue/reactivity",
        filePath: "packages/reactivity/src/computed.ts",
        symbol: "computed",
        lines: "L189-L221",
        confidence: "verified",
      },
    },
    {
      id: "computed-ref-impl",
      label: "ComputedRefImpl",
      kind: "class",
      summary: "computed 的运行时容器，保存 getter、setter、dep、flags 和缓存值。",
      source: sourceReference(
        "Vue 3.5.38 源码：ComputedRefImpl",
        "packages/reactivity/src/computed.ts",
        "ComputedRefImpl",
        "#L47-L145",
      ),
      metadata: {
        packageName: "@vue/reactivity",
        filePath: "packages/reactivity/src/computed.ts",
        symbol: "ComputedRefImpl",
        lines: "L47-L145",
        confidence: "verified",
      },
    },
    {
      id: "computed-value",
      label: "computed.value",
      kind: "function",
      summary: "读取 value 时先 track 当前订阅者，再 refreshComputed() 保证缓存新鲜。",
      source: sourceReference(
        "Vue 3.5.38 源码：ComputedRefImpl.get value",
        "packages/reactivity/src/computed.ts",
        "get value",
        "#L131-L145",
      ),
      metadata: {
        packageName: "@vue/reactivity",
        filePath: "packages/reactivity/src/computed.ts",
        symbol: "ComputedRefImpl.get value",
        lines: "L131-L145",
        confidence: "verified",
      },
    },
    {
      id: "refresh-computed",
      label: "refreshComputed()",
      kind: "function",
      summary: "按需检查脏状态和全局版本，必要时执行 getter 并更新缓存。",
      source: sourceReference(
        "Vue 3.5.38 源码：refreshComputed",
        "packages/reactivity/src/effect.ts",
        "refreshComputed",
        "#L376-L430",
      ),
      metadata: {
        packageName: "@vue/reactivity",
        filePath: "packages/reactivity/src/effect.ts",
        symbol: "refreshComputed",
        lines: "L376-L430",
        confidence: "verified",
      },
    },
    {
      id: "dep",
      label: "Dep",
      kind: "class",
      summary: "依赖容器，连接被读取的数据与订阅它的 effect/computed。",
      source: sourceReference(
        "Vue 3.5.38 源码：Dep",
        "packages/reactivity/src/dep.ts",
        "Dep",
        "#L67-L199",
      ),
      metadata: {
        packageName: "@vue/reactivity",
        filePath: "packages/reactivity/src/dep.ts",
        symbol: "Dep",
        lines: "L67-L199",
        confidence: "verified",
      },
    },
    {
      id: "reactive-effect",
      label: "ReactiveEffect",
      kind: "class",
      summary: "执行响应式副作用的基础单元，computed 与 watch 都复用 effect 机制。",
      source: sourceReference(
        "Vue 3.5.38 源码：ReactiveEffect",
        "packages/reactivity/src/effect.ts",
        "ReactiveEffect",
        "#L87-L222",
      ),
      metadata: {
        packageName: "@vue/reactivity",
        filePath: "packages/reactivity/src/effect.ts",
        symbol: "ReactiveEffect",
        lines: "L87-L222",
        confidence: "verified",
      },
    },
    {
      id: "ref",
      label: "ref() / RefImpl",
      kind: "api",
      summary: "computed getter 常读取 ref.value，ref 的 dep 会成为 computed 的底层依赖。",
      source: sourceReference(
        "Vue 3.5.38 源码：ref.ts",
        "packages/reactivity/src/ref.ts",
        "RefImpl",
        "#L104-L165",
      ),
      metadata: {
        packageName: "@vue/reactivity",
        filePath: "packages/reactivity/src/ref.ts",
        symbol: "RefImpl",
        lines: "L104-L165",
        confidence: "verified",
      },
    },
    {
      id: "reactive-proxy",
      label: "reactive proxy",
      kind: "concept",
      summary: "computed getter 也可以读取 reactive 对象属性，Proxy get/trigger 进入相同的 dep 链路。",
      source: sourceReference(
        "Vue 3.5.38 源码：baseHandlers.get",
        "packages/reactivity/src/baseHandlers.ts",
        "BaseReactiveHandler.get",
        "#L49-L107",
      ),
      metadata: {
        packageName: "@vue/reactivity",
        filePath: "packages/reactivity/src/baseHandlers.ts",
        symbol: "BaseReactiveHandler.get",
        lines: "L49-L107",
        confidence: "verified",
      },
    },
    {
      id: "watch-effect",
      label: "watchEffect() / render effect",
      kind: "concept",
      summary: "读取 computed.value 的外层 effect 会订阅 computed 自己的 dep。",
      source: sourceReference(
        "Vue 3.5.38 源码：ReactiveEffect",
        "packages/reactivity/src/effect.ts",
        "ReactiveEffect",
        "#L162-L222",
      ),
      metadata: {
        packageName: "@vue/reactivity",
        filePath: "packages/reactivity/src/effect.ts",
        symbol: "ReactiveEffect",
        lines: "L162-L222",
        confidence: "verified",
      },
    },
    {
      id: "cache-design",
      label: "lazy cache",
      kind: "concept",
      summary: "computed 不在依赖变化时立即重算，而是在下一次读取时按需刷新。",
      metadata: {
        packageName: "@vue/reactivity",
        symbol: "dirty flags / globalVersion",
        confidence: "inferred",
      },
    },
  ],
  edges: [
    {
      id: "e1",
      source: "computed-api",
      target: "computed-ref-impl",
      relation: "creates",
      label: "创建实例",
      direction: "forward",
    },
    {
      id: "e2",
      source: "computed-ref-impl",
      target: "computed-value",
      relation: "reads",
      label: "暴露 value getter",
      direction: "forward",
    },
    {
      id: "e3",
      source: "computed-value",
      target: "dep",
      relation: "tracks",
      label: "读取时收集外层订阅者",
      direction: "forward",
    },
    {
      id: "e4",
      source: "computed-value",
      target: "refresh-computed",
      relation: "refreshes",
      label: "读取时按需刷新",
      direction: "forward",
    },
    {
      id: "e5",
      source: "refresh-computed",
      target: "reactive-effect",
      relation: "depends-on",
      label: "执行 getter 并建立依赖",
      direction: "forward",
    },
    {
      id: "e6",
      source: "refresh-computed",
      target: "ref",
      relation: "depends-on",
      label: "getter 读取 ref.value",
      direction: "forward",
    },
    {
      id: "e7",
      source: "refresh-computed",
      target: "reactive-proxy",
      relation: "depends-on",
      label: "getter 读取 reactive 属性",
      direction: "forward",
    },
    {
      id: "e8",
      source: "ref",
      target: "computed-ref-impl",
      relation: "invalidates",
      label: "底层依赖变化使 computed 失效",
      direction: "reverse",
    },
    {
      id: "e9",
      source: "reactive-proxy",
      target: "computed-ref-impl",
      relation: "invalidates",
      label: "属性变化使 computed 失效",
      direction: "reverse",
    },
    {
      id: "e10",
      source: "computed-ref-impl",
      target: "watch-effect",
      relation: "triggers",
      label: "通知读取 computed 的订阅者",
      direction: "reverse",
    },
    {
      id: "e11",
      source: "computed-ref-impl",
      target: "cache-design",
      relation: "depends-on",
      label: "脏标记与版本控制支撑缓存",
      direction: "forward",
    },
  ],
  directDependencies: [
    "ComputedRefImpl",
    "Dep",
    "refreshComputed()",
    "ReactiveEffect",
    "ref() / reactive proxy",
  ],
  reverseDependencies: [
    "watchEffect() 读取 computed.value 时订阅 computed 的 dep",
    "组件渲染 effect 读取 computed.value 时会在 computed 失效后被通知",
    "其他 computed 读取当前 computed.value 时形成派生依赖链",
  ],
  dataFlow: [
    "用户调用 computed(getter)，创建 ComputedRefImpl。",
    "外层 effect 首次读取 computed.value，computed 的 dep 收集外层订阅者。",
    "refreshComputed() 执行 getter，getter 内读取 ref 或 reactive 属性，底层 dep 记录 computed 订阅关系。",
    "底层 ref/reactive 变化时通知 computed，使缓存失效并通知 computed 的订阅者。",
    "下一次读取 computed.value 时 refreshComputed() 重新执行 getter，返回新缓存值。",
  ],
  readingPath: [
    {
      nodeId: "computed-api",
      reason: "先看公共 API 如何把 getter 包装为 ComputedRefImpl。",
    },
    {
      nodeId: "computed-value",
      reason: "再看 value getter 如何把读取行为拆成 track 与 refresh。",
    },
    {
      nodeId: "refresh-computed",
      reason: "理解 computed 缓存和按需重算的核心。",
    },
    {
      nodeId: "dep",
      reason: "理解 computed 如何同时订阅底层依赖并被外层 effect 订阅。",
    },
    {
      nodeId: "ref",
      reason: "用 ref.value 变化验证 computed 失效和重新计算。",
    },
  ],
  references: [
    sourceReference(
      "Vue 3.5.38 源码：computed.ts",
      "packages/reactivity/src/computed.ts",
      "computed / ComputedRefImpl",
    ),
    sourceReference(
      "Vue 3.5.38 源码：effect.ts",
      "packages/reactivity/src/effect.ts",
      "refreshComputed / ReactiveEffect",
    ),
    sourceReference(
      "Vue 3.5.38 源码：dep.ts",
      "packages/reactivity/src/dep.ts",
      "Dep",
    ),
    {
      title: "Vue 官方文档：computed()",
      sourceType: "official-doc",
      url: "https://vuejs.org/api/reactivity-core.html#computed",
      version: "Vue 3.5",
      symbol: "computed",
    },
  ],
  evidenceNotice:
    "源码路径、符号和行号基于 Vue core v3.5.38 tag 核对；lazy cache 的设计说明是依据 dirty flags、globalVersion 与 refreshComputed() 行为作出的解释性推断。",
};

@Injectable()
export class KnowledgeGraphService {
  query(request: QueryKnowledgeGraphRequest): KnowledgeGraphResult {
    const normalizedConcept = request.concept.trim().toLowerCase();

    if (!["computed", "computed()", "vue computed"].includes(normalizedConcept)) {
      throw new NotFoundException(
        "当前 MVP 先支持 computed 知识图谱样例。",
      );
    }

    return {
      ...COMPUTED_GRAPH,
      concept: request.concept.trim(),
      level: request.level,
    };
  }
}
