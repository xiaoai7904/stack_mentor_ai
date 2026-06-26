<script setup lang="ts">
import type { CallChainStep, LearnerLevel } from "@stack-mentor/types";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Braces,
  CheckCircle2,
  Clock3,
  GitBranch,
  Layers3,
  LoaderCircle,
  Play,
  RadioTower,
  Route,
} from "@lucide/vue";
import Button from "primevue/button";
import Message from "primevue/message";
import SelectButton from "primevue/selectbutton";
import Textarea from "primevue/textarea";
import AnimatedContent from "@/components/motion/AnimatedContent.vue";
import { useCallChainAnalysis } from "@/hooks/useCallChainAnalysis";

const {
  snippet,
  level,
  result,
  isLoading,
  error,
  canSubmit,
  analyze,
  setLevel,
} = useCallChainAnalysis();

const levelOptions: Array<{ label: string; value: LearnerLevel }> = [
  { label: "初级", value: "beginner" },
  { label: "中级", value: "intermediate" },
  { label: "高级", value: "advanced" },
];

const categoryMeta: Record<
  CallChainStep["category"],
  { label: string; icon: typeof Play }
> = {
  sync: { label: "同步触发", icon: Play },
  reactivity: { label: "响应式触发", icon: RadioTower },
  scheduler: { label: "异步调度", icon: Clock3 },
  result: { label: "最终结果", icon: CheckCircle2 },
};
</script>

<template>
  <div class="call-chain-page">
    <AnimatedContent>
      <section class="call-chain-hero">
        <div class="call-chain-hero__copy">
          <span class="section-kicker">Call Chain</span>
          <h1>把一行代码拆成源码执行链</h1>
          <p>输入 Vue3 响应式代码片段，区分同步执行、依赖触发、调度队列和最终可见结果。</p>
        </div>

        <form class="call-chain-form" @submit.prevent="analyze()">
          <div class="call-chain-form__head">
            <div>
              <Braces :size="20" />
              <span>可验证样例</span>
            </div>
            <SelectButton
              :model-value="level"
              :options="levelOptions"
              option-label="label"
              option-value="value"
              :allow-empty="false"
              aria-label="分析深度"
              @update:model-value="setLevel"
            />
          </div>
          <Textarea
            v-model="snippet"
            auto-resize
            rows="8"
            aria-label="调用链代码片段"
            spellcheck="false"
          />
          <div class="call-chain-form__actions">
            <span>当前 MVP 支持：<code>count.value++</code> 触发 <code>watch</code></span>
            <Button type="submit" :disabled="!canSubmit">
              <LoaderCircle v-if="isLoading" class="spin" :size="17" />
              <span>{{ isLoading ? "分析中" : "分析调用链" }}</span>
            </Button>
          </div>
        </form>
      </section>
    </AnimatedContent>

    <Message v-if="error" severity="warn" :closable="false">{{ error }}</Message>

    <div v-if="isLoading && !result" class="call-chain-loading">
      <LoaderCircle class="spin" :size="28" />
      <strong>正在拆解调用链</strong>
      <span>核对 ref、watch、effect 与 scheduler 的源码路径...</span>
    </div>

    <template v-if="result">
      <div class="call-chain-grid">
        <AnimatedContent :delay="0.08">
          <section class="call-chain-summary">
            <div class="source-section-heading">
              <Route :size="20" />
              <h2>执行摘要</h2>
            </div>
            <p>{{ result.summary }}</p>
            <div class="call-chain-outcome">
              <span>触发语句</span>
              <code>{{ result.triggerStatement }}</code>
              <strong>{{ result.visibleResult }}</strong>
            </div>
          </section>
        </AnimatedContent>

        <AnimatedContent :delay="0.12">
          <section class="call-chain-flow-panel">
            <div class="source-section-heading">
              <GitBranch :size="20" />
              <h2>链路图</h2>
            </div>
            <div class="call-chain-flow">
              <template v-for="(step, index) in result.steps" :key="step.id">
                <article class="flow-node" :data-category="step.category">
                  <component :is="categoryMeta[step.category].icon" :size="18" />
                  <div>
                    <span>{{ categoryMeta[step.category].label }}</span>
                    <strong>{{ step.title }}</strong>
                    <code>{{ step.sourceFile }} {{ step.sourceLines }}</code>
                  </div>
                </article>
                <ArrowDown v-if="index < result.steps.length - 1" :size="18" />
              </template>
            </div>
          </section>
        </AnimatedContent>
      </div>

      <div class="call-chain-detail-grid">
        <AnimatedContent :delay="0.16">
          <section class="call-chain-stage-panel">
            <div class="source-section-heading">
              <Play :size="20" />
              <h2>同步流程</h2>
            </div>
            <ol>
              <li v-for="item in result.syncFlow" :key="item">{{ item }}</li>
            </ol>
          </section>
        </AnimatedContent>

        <AnimatedContent :delay="0.2">
          <section class="call-chain-stage-panel">
            <div class="source-section-heading">
              <RadioTower :size="20" />
              <h2>响应式触发</h2>
            </div>
            <ol>
              <li v-for="item in result.reactiveFlow" :key="item">{{ item }}</li>
            </ol>
          </section>
        </AnimatedContent>

        <AnimatedContent :delay="0.24">
          <section class="call-chain-stage-panel">
            <div class="source-section-heading">
              <Clock3 :size="20" />
              <h2>异步调度</h2>
            </div>
            <ol>
              <li v-for="item in result.schedulerFlow" :key="item">{{ item }}</li>
            </ol>
          </section>
        </AnimatedContent>
      </div>

      <AnimatedContent :delay="0.28">
        <section class="call-chain-step-table">
          <div class="source-section-heading">
            <Layers3 :size="20" />
            <h2>关键节点</h2>
          </div>
          <div class="call-chain-steps">
            <article v-for="step in result.steps" :key="step.id">
              <header>
                <span>{{ categoryMeta[step.category].label }}</span>
                <code>{{ step.sourceLines }}</code>
              </header>
              <h3>{{ step.title }}</h3>
              <p>{{ step.summary }}</p>
              <small>{{ step.detail }}</small>
            </article>
          </div>
        </section>
      </AnimatedContent>

      <section class="call-chain-evidence-panel">
        <div>
          <span class="section-kicker">Why this design</span>
          <p>{{ result.designMotivation }}</p>
          <small>{{ result.evidenceNotice }}</small>
        </div>
        <div class="call-chain-source-list">
          <a
            v-for="source in result.sourceFiles"
            :key="source.url"
            :href="source.url"
            target="_blank"
            rel="noreferrer"
          >
            <span>{{ source.filePath }}</span>
            <code>{{ source.symbols.join(" · ") }}</code>
            <ArrowUpRight :size="17" />
          </a>
        </div>
      </section>
    </template>
  </div>
</template>
