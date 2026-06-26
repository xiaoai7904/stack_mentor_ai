<script setup lang="ts">
import type { LearnerLevel } from "@stack-mentor/types";
import {
  ArrowDown,
  ArrowUpRight,
  BookOpenCheck,
  Check,
  Clipboard,
  ExternalLink,
  FileCode2,
  GitCommitHorizontal,
  Lightbulb,
  LoaderCircle,
  Play,
  Search,
  Target,
} from "@lucide/vue";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Message from "primevue/message";
import SelectButton from "primevue/selectbutton";
import { ref } from "vue";
import AnimatedContent from "@/components/motion/AnimatedContent.vue";
import SourceCodeEditor from "@/components/source/SourceCodeEditor.vue";
import { useSourceReader } from "@/hooks/useSourceReader";

const {
  topic,
  level,
  result,
  isLoading,
  error,
  canSubmit,
  analyze,
  setLevel,
} = useSourceReader();

const editor = ref<InstanceType<typeof SourceCodeEditor> | null>(null);
const copied = ref(false);
const levelOptions: Array<{ label: string; value: LearnerLevel }> = [
  { label: "初级", value: "beginner" },
  { label: "中级", value: "intermediate" },
  { label: "高级", value: "advanced" },
];

async function copyPath() {
  if (!result.value) return;
  await navigator.clipboard.writeText(result.value.file.filePath);
  copied.value = true;
  window.setTimeout(() => {
    copied.value = false;
  }, 1500);
}
</script>

<template>
  <div class="source-reader-page">
    <AnimatedContent>
      <section class="source-reader-toolbar">
        <div>
          <span class="section-kicker">Source Reader</span>
          <h1>源码阅读助手</h1>
          <p>定位入口、关键符号与调用关系，并解释实现背后的设计取舍。</p>
        </div>
        <form class="source-search-form" @submit.prevent="analyze()">
          <Search :size="19" />
          <InputText v-model="topic" aria-label="源码主题" placeholder="例如：Vue3 ref 原理" />
          <Button type="submit" :disabled="!canSubmit">
            <LoaderCircle v-if="isLoading" class="spin" :size="17" />
            <span>{{ isLoading ? "定位中" : "定位源码" }}</span>
          </Button>
        </form>
        <SelectButton
          :model-value="level"
          :options="levelOptions"
          option-label="label"
          option-value="value"
          :allow-empty="false"
          aria-label="阅读深度"
          @update:model-value="setLevel"
        />
      </section>
    </AnimatedContent>

    <Message v-if="error" severity="warn" :closable="false">{{ error }}</Message>

    <div v-if="isLoading && !result" class="source-loading">
      <LoaderCircle class="spin" :size="28" />
      <strong>正在定位源码证据</strong>
      <span>核对版本、文件路径和关键符号...</span>
    </div>

    <template v-if="result">
      <AnimatedContent :delay="0.06">
        <section class="source-file-bar">
          <div class="source-file-meta">
            <FileCode2 :size="19" />
            <div>
              <span>源码文件</span>
              <code>{{ result.file.filePath }}</code>
            </div>
          </div>
          <div class="source-version-meta">
            <span>{{ result.file.version }}</span>
            <code>{{ result.file.commit.slice(0, 10) }}</code>
          </div>
          <div class="source-file-actions">
            <button type="button" @click="copyPath">
              <Check v-if="copied" :size="16" />
              <Clipboard v-else :size="16" />
              {{ copied ? "已复制" : "复制路径" }}
            </button>
            <a :href="result.file.url" target="_blank" rel="noreferrer">
              <ExternalLink :size="16" />
              GitHub
            </a>
          </div>
        </section>
      </AnimatedContent>

      <div class="source-workspace">
        <AnimatedContent :delay="0.1">
          <section class="source-editor-panel">
            <header>
              <div><span class="status-dot" /> ref.ts</div>
              <span>{{ result.file.language }} · {{ result.file.startLine }}-{{ result.file.endLine }}</span>
            </header>
            <SourceCodeEditor
              ref="editor"
              :content="result.file.content"
              :language="result.file.language"
              :start-line="result.file.startLine"
            />
          </section>
        </AnimatedContent>

        <AnimatedContent :delay="0.14">
          <aside class="source-analysis-panel">
            <section class="source-summary">
              <div class="source-section-heading">
                <BookOpenCheck :size="19" />
                <h2>实现摘要</h2>
              </div>
              <p>{{ result.summary }}</p>
            </section>

            <section class="source-motivation">
              <div class="source-section-heading">
                <Lightbulb :size="19" />
                <h2>为什么这样设计</h2>
              </div>
              <p>{{ result.designMotivation }}</p>
            </section>

            <section>
              <div class="source-section-heading">
                <Target :size="19" />
                <h2>关键符号</h2>
              </div>
              <div class="symbol-list">
                <button
                  v-for="symbol in result.keySymbols"
                  :key="symbol.name"
                  type="button"
                  @click="editor?.revealSourceLine(symbol.line)"
                >
                  <div>
                    <code>{{ symbol.name }}</code>
                    <span>第 {{ symbol.line }} 行 · {{ symbol.kind }}</span>
                  </div>
                  <p>{{ symbol.description }}</p>
                </button>
              </div>
            </section>

            <section>
              <div class="source-section-heading">
                <GitCommitHorizontal :size="19" />
                <h2>调用链</h2>
              </div>
              <div class="source-call-chain">
                <template v-for="(step, index) in result.callChain" :key="step">
                  <code>{{ step }}</code>
                  <ArrowDown v-if="index < result.callChain.length - 1" :size="15" />
                </template>
              </div>
            </section>
          </aside>
        </AnimatedContent>
      </div>

      <div class="source-learning-grid">
        <AnimatedContent :delay="0.18">
          <section class="source-learning-panel">
            <div class="source-section-heading">
              <BookOpenCheck :size="19" />
              <h2>推荐阅读顺序</h2>
            </div>
            <ol class="source-reading-order">
              <li v-for="(item, index) in result.readingOrder" :key="item.filePath">
                <span>{{ index + 1 }}</span>
                <div>
                  <code>{{ item.filePath }}</code>
                  <strong>{{ item.symbol }}</strong>
                  <p>{{ item.reason }}</p>
                </div>
              </li>
            </ol>
          </section>
        </AnimatedContent>

        <AnimatedContent :delay="0.22">
          <section class="source-learning-panel">
            <div class="source-section-heading">
              <Play :size="19" />
              <h2>验证练习</h2>
            </div>
            <strong>{{ result.exercise.title }}</strong>
            <pre><code>{{ result.exercise.code }}</code></pre>
            <p class="exercise-result">{{ result.exercise.expected }}</p>
            <div class="prerequisite-list">
              <span v-for="item in result.prerequisites" :key="item">{{ item }}</span>
            </div>
          </section>
        </AnimatedContent>
      </div>

      <section class="source-evidence-panel">
        <div>
          <span class="section-kicker">Evidence</span>
          <p>{{ result.evidenceNotice }}</p>
        </div>
        <a
          v-for="reference in result.references"
          :key="reference.url"
          :href="reference.url"
          target="_blank"
          rel="noreferrer"
        >
          <span>{{ reference.title }}</span>
          <ArrowUpRight :size="17" />
        </a>
      </section>
    </template>
  </div>
</template>
