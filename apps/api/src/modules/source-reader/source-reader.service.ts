import { Injectable, NotFoundException } from "@nestjs/common";
import type {
  LocateSourceRequest,
  SourceReadingResult,
} from "@stack-mentor/types";

const REF_SOURCE = `export function ref<T>(
  value: T,
): [T] extends [Ref] ? IfAny<T, Ref<T>, T> : Ref<UnwrapRef<T>, UnwrapRef<T> | T>
export function ref<T = any>(): Ref<T | undefined>
/*@__NO_SIDE_EFFECTS__*/
export function ref(value?: unknown) {
  return createRef(value, false)
}

declare const ShallowRefMarker: unique symbol

export type ShallowRef<T = any, S = T> = Ref<T, S> & {
  [ShallowRefMarker]?: true
}

/**
 * Shallow version of {@link ref}.
 *
 * @example
 * \`\`\`js
 * const state = shallowRef({ count: 1 })
 *
 * // does NOT trigger change
 * state.value.count = 2
 *
 * // does trigger change
 * state.value = { count: 2 }
 * \`\`\`
 *
 * @param value - The "inner value" for the shallow ref.
 * @see {@link https://vuejs.org/api/reactivity-advanced.html#shallowref}
 */
export function shallowRef<T>(
  value: T,
): Ref extends T
  ? T extends Ref
    ? IfAny<T, ShallowRef<T>, T>
    : ShallowRef<T>
  : ShallowRef<T>
export function shallowRef<T = any>(): ShallowRef<T | undefined>
/*@__NO_SIDE_EFFECTS__*/
export function shallowRef(value?: unknown) {
  return createRef(value, true)
}

function createRef(rawValue: unknown, shallow: boolean) {
  if (isRef(rawValue)) {
    return rawValue
  }
  return new RefImpl(rawValue, shallow)
}

class RefImpl<T = any> {
  _value: T
  private _rawValue: T

  dep: Dep = new Dep()

  public readonly [ReactiveFlags.IS_REF] = true
  public readonly [ReactiveFlags.IS_SHALLOW]: boolean = false

  constructor(value: T, isShallow: boolean) {
    this._rawValue = isShallow ? value : toRaw(value)
    this._value = isShallow ? value : toReactive(value)
    this[ReactiveFlags.IS_SHALLOW] = isShallow
  }

  get value() {
    if (__DEV__) {
      this.dep.track({
        target: this,
        type: TrackOpTypes.GET,
        key: 'value',
      })
    } else {
      this.dep.track()
    }
    return this._value
  }

  set value(newValue) {
    const oldValue = this._rawValue
    const useDirectValue =
      this[ReactiveFlags.IS_SHALLOW] ||
      isShallow(newValue) ||
      isReadonly(newValue)
    newValue = useDirectValue ? newValue : toRaw(newValue)
    if (hasChanged(newValue, oldValue)) {
      this._rawValue = newValue
      this._value = useDirectValue ? newValue : toReactive(newValue)
      if (__DEV__) {
        this.dep.trigger({
          target: this,
          type: TriggerOpTypes.SET,
          key: 'value',
          newValue,
          oldValue,
        })
      } else {
        this.dep.trigger()
      }
    }
  }
}`;

const REF_READING_RESULT: SourceReadingResult = {
  topic: "Vue3 ref 原理",
  level: "intermediate",
  summary:
    "ref() 先通过 createRef() 复用已有 ref，否则创建 RefImpl。读取 .value 时由 Dep.track() 收集订阅者；写入时先比较原始值，发生变化后更新响应式值并通过 Dep.trigger() 通知依赖。",
  designMotivation:
    "ref 使用显式的 .value，是为了让基本类型也能拥有稳定的可追踪容器，同时让 getter/setter 成为依赖收集和触发更新的明确边界。_rawValue 用于可靠比较，_value 用于保存可能已转换为 reactive 的公开值。",
  file: {
    repository: "vuejs/core",
    filePath: "packages/reactivity/src/ref.ts",
    version: "v3.5.38",
    commit: "478e3e83acd34dd213a860be4a2a2bf2090dc26b",
    language: "typescript",
    startLine: 59,
    endLine: 165,
    content: REF_SOURCE,
    url: "https://github.com/vuejs/core/blob/v3.5.38/packages/reactivity/src/ref.ts#L59-L165",
  },
  keySymbols: [
    {
      name: "ref",
      kind: "function",
      line: 59,
      description: "公共入口，将创建逻辑委托给 createRef(value, false)。",
    },
    {
      name: "createRef",
      kind: "function",
      line: 104,
      description: "避免重复包装已有 ref，并负责实例化 RefImpl。",
    },
    {
      name: "RefImpl",
      kind: "class",
      line: 114,
      description: "保存原始值、公开值和 Dep，承载 value 的 getter/setter。",
    },
    {
      name: "get value",
      kind: "method",
      line: 129,
      description: "调用 dep.track() 建立当前 effect 与 ref 的订阅关系。",
    },
    {
      name: "set value",
      kind: "method",
      line: 142,
      description: "比较值、完成转换，并调用 dep.trigger() 通知订阅者。",
    },
  ],
  readingOrder: [
    {
      filePath: "packages/reactivity/src/ref.ts",
      symbol: "ref → createRef → RefImpl",
      reason: "先理解 ref 容器自身如何创建、读取和写入。",
    },
    {
      filePath: "packages/reactivity/src/dep.ts",
      symbol: "Dep.track / Dep.trigger",
      reason: "理解 ref 如何连接当前 active effect 与订阅者链表。",
    },
    {
      filePath: "packages/reactivity/src/effect.ts",
      symbol: "ReactiveEffect",
      reason: "理解被通知的 effect 如何运行、暂停和调度。",
    },
    {
      filePath: "packages/reactivity/src/reactive.ts",
      symbol: "toRaw / toReactive",
      reason: "理解对象写入 ref 后为何会转换为 reactive。",
    },
  ],
  callChain: [
    "ref(rawValue)",
    "createRef(rawValue, false)",
    "new RefImpl(rawValue, false)",
    "读取 value → dep.track()",
    "写入 value → hasChanged() → dep.trigger()",
  ],
  prerequisites: [
    "JavaScript getter / setter",
    "对象引用与 Object.is 比较语义",
    "Vue effect 和依赖收集的基本概念",
  ],
  exercise: {
    title: "验证相同值不会重复触发",
    code: `const count = ref(0)
watchEffect(() => console.log(count.value))

count.value = 0
count.value = 1`,
    expected: "首次运行输出 0；重复写入 0 不触发；写入 1 后再次输出。",
  },
  references: [
    {
      title: "Vue 官方文档：ref()",
      sourceType: "official-doc",
      url: "https://vuejs.org/api/reactivity-core.html#ref",
      version: "Vue 3.5",
      symbol: "ref",
    },
    {
      title: "Vue 3.5.38 源码：ref.ts",
      sourceType: "source-code",
      url: "https://github.com/vuejs/core/blob/v3.5.38/packages/reactivity/src/ref.ts",
      repository: "vuejs/core",
      filePath: "packages/reactivity/src/ref.ts",
      version: "v3.5.38",
      commit: "478e3e83acd34dd213a860be4a2a2bf2090dc26b",
      symbol: "ref / RefImpl",
    },
  ],
  evidenceNotice:
    "源码位置、行号、版本和 commit 已固定到 Vue v3.5.38；设计动机是基于实现结构的解释性归纳。",
};

@Injectable()
export class SourceReaderService {
  locate(request: LocateSourceRequest): SourceReadingResult {
    if (!request.topic.toLowerCase().includes("ref")) {
      throw new NotFoundException(
        `首版源码样例仅支持 ref，${request.topic} 需要接入知识库后检索。`,
      );
    }

    return {
      ...REF_READING_RESULT,
      topic: request.topic,
      level: request.level,
    };
  }
}
