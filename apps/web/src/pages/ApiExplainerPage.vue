<script setup lang="ts">
import {
  AlertTriangle,
  ArrowUpRight,
  BookOpen,
  Braces,
  CheckCircle2,
  CircleHelp,
  Gauge,
  GitBranch,
  Lightbulb,
  LoaderCircle,
  Search,
  ShieldCheck,
} from "@lucide/vue";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Message from "primevue/message";
import SelectButton from "primevue/selectbutton";
import Tag from "primevue/tag";
import AnimatedContent from "@/components/motion/AnimatedContent.vue";
import CallChainPanel from "@/components/api/CallChainPanel.vue";
import CodeBlock from "@/components/api/CodeBlock.vue";
import { useApiExplainer } from "@/hooks/useApiExplainer";
import type { LearnerLevel } from "@stack-mentor/types";

const {
  query,
  level,
  result,
  isLoading,
  error,
  canSubmit,
  analyze,
  setLevel,
} = useApiExplainer();

const popularApis = ["watch", "watchEffect", "computed", "reactive"];
const levelOptions: Array<{ label: string; value: LearnerLevel }> = [
  { label: "初级", value: "beginner" },
  { label: "中级", value: "intermediate" },
  { label: "高级", value: "advanced" },
];
</script>

<template>
  <div class="api-page">
    <AnimatedContent>
      <section class="api-search-panel">
        <div class="api-search-panel__intro">
          <span class="section-kicker">API Explainer</span>
          <h1>从 API 用法追到源码设计</h1>
          <p>输入 Vue3 API，获得分层解释、调用链、源码阅读顺序和可信引用。</p>
        </div>
        <form class="api-search-form" @submit.prevent="analyze()">
          <Search :size="20" />
          <InputText v-model="query" aria-label="Vue3 API" placeholder="例如 watch、ref、computed" />
          <Button type="submit" :disabled="!canSubmit">
            <LoaderCircle v-if="isLoading" class="spin" :size="18" />
            <span>{{ isLoading ? "检索中" : "开始分析" }}</span>
          </Button>
        </form>
        <div class="popular-apis">
          <span>常用示例</span>
          <button v-for="api in popularApis" :key="api" type="button" @click="analyze(api)">
            {{ api }}
          </button>
        </div>
        <Message v-if="error" severity="warn" :closable="false">{{ error }}</Message>
      </section>
    </AnimatedContent>

    <div class="api-layout">
      <AnimatedContent :delay="0.08">
        <article class="explanation-panel">
          <header class="explanation-header">
            <div>
              <div class="api-title-row">
                <h2>{{ result.api }}</h2>
                <Tag severity="success" value="Vue 3" />
                <Tag severity="secondary" value="可验证样例" />
              </div>
              <code>{{ result.signature }}</code>
            </div>
            <SelectButton
              :model-value="level"
              :options="levelOptions"
              option-label="label"
              option-value="value"
              :allow-empty="false"
              aria-label="学习深度"
              @update:model-value="setLevel"
            />
          </header>

          <section class="explanation-section">
            <div class="section-title"><BookOpen :size="20" /><h3>是什么</h3></div>
            <p class="lead">{{ result.summary }}</p>
          </section>

          <section class="explanation-section">
            <div class="section-title"><Braces :size="20" /><h3>怎么用</h3></div>
            <div class="definition-grid">
              <div v-for="parameter in result.parameters" :key="parameter.name">
                <code>{{ parameter.name }}</code>
                <p>{{ parameter.description }}</p>
              </div>
            </div>
            <p class="return-note"><strong>返回值：</strong>{{ result.returns }}</p>
            <CodeBlock :code="result.example" />
          </section>

          <section class="explanation-section motivation-section">
            <div class="section-title"><Lightbulb :size="20" /><h3>为什么这样设计</h3></div>
            <p>{{ result.designMotivation }}</p>
          </section>

          <div class="two-column-sections">
            <section class="explanation-section compact-section">
              <div class="section-title"><CheckCircle2 :size="20" /><h3>适用场景</h3></div>
              <ul class="check-list">
                <li v-for="item in result.useCases" :key="item"><CheckCircle2 :size="17" />{{ item }}</li>
              </ul>
            </section>
            <section class="explanation-section compact-section">
              <div class="section-title"><AlertTriangle :size="20" /><h3>常见错误</h3></div>
              <ul class="warning-list">
                <li v-for="item in result.commonMistakes" :key="item">{{ item }}</li>
              </ul>
            </section>
          </div>

          <section class="explanation-section">
            <div class="section-title"><Gauge :size="20" /><h3>性能与调度</h3></div>
            <ul class="numbered-list">
              <li v-for="(item, index) in result.performanceNotes" :key="item">
                <span>{{ index + 1 }}</span>{{ item }}
              </li>
            </ul>
          </section>

          <section class="explanation-section source-section">
            <div class="section-title"><GitBranch :size="20" /><h3>源码在哪里读</h3></div>
            <div class="source-path">
              <code>{{ result.sourceLocation.filePath }}</code>
              <span>{{ result.sourceLocation.symbols.join(" · ") }}</span>
            </div>
            <ol class="reading-order">
              <li v-for="path in result.sourceLocation.readingOrder" :key="path">
                <code>{{ path }}</code>
              </li>
            </ol>
          </section>

          <section class="explanation-section references-section">
            <div class="section-title"><ShieldCheck :size="20" /><h3>引用来源</h3></div>
            <p class="evidence-notice">{{ result.evidenceNotice }}</p>
            <a
              v-for="reference in result.references"
              :key="reference.url"
              :href="reference.url"
              target="_blank"
              rel="noreferrer"
              class="reference-item"
            >
              <div>
                <strong>{{ reference.title }}</strong>
                <span>{{ reference.filePath ?? reference.version }}</span>
              </div>
              <ArrowUpRight :size="18" />
            </a>
          </section>

          <footer class="related-apis">
            <span>继续学习</span>
            <button v-for="api in result.relatedApis" :key="api" type="button" @click="analyze(api)">
              {{ api }}
            </button>
          </footer>
        </article>
      </AnimatedContent>

      <AnimatedContent :delay="0.14">
        <CallChainPanel :steps="result.callChain" />
      </AnimatedContent>
    </div>
  </div>
</template>
