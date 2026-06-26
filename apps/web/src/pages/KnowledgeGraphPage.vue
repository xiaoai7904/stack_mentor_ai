<script setup lang="ts">
import type { KnowledgeGraphEdge, KnowledgeGraphNode, LearnerLevel } from "@stack-mentor/types";
import type { Edge, Node } from "@vue-flow/core";
import { VueFlow, useVueFlow } from "@vue-flow/core";
import "@vue-flow/core/dist/style.css";
import "@vue-flow/core/dist/theme-default.css";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpenCheck,
  GitFork,
  LoaderCircle,
  Network,
  Search,
  Target,
} from "@lucide/vue";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Message from "primevue/message";
import SelectButton from "primevue/selectbutton";
import { computed, nextTick, watch } from "vue";
import AnimatedContent from "@/components/motion/AnimatedContent.vue";
import { useKnowledgeGraph } from "@/hooks/useKnowledgeGraph";

const {
  concept,
  level,
  result,
  selectedNodeId,
  selectedNode,
  isLoading,
  error,
  canSubmit,
  query,
  setLevel,
  selectNode,
} = useKnowledgeGraph();

const levelOptions: Array<{ label: string; value: LearnerLevel }> = [
  { label: "初级", value: "beginner" },
  { label: "中级", value: "intermediate" },
  { label: "高级", value: "advanced" },
];

const nodePositions: Record<string, { x: number; y: number }> = {
  "computed-api": { x: 80, y: 210 },
  "computed-ref-impl": { x: 360, y: 210 },
  "computed-value": { x: 640, y: 210 },
  "refresh-computed": { x: 930, y: 210 },
  dep: { x: 640, y: 30 },
  "reactive-effect": { x: 930, y: 30 },
  ref: { x: 930, y: 390 },
  "reactive-proxy": { x: 930, y: 535 },
  "watch-effect": { x: 360, y: 30 },
  "cache-design": { x: 360, y: 390 },
};

const graphNodes = computed<Node[]>(() =>
  (result.value?.nodes ?? []).map((node) => ({
    id: node.id,
    position: nodePositions[node.id] ?? { x: 0, y: 0 },
    data: {
      label: node.label,
      kind: node.kind,
      summary: node.summary,
      verified: node.metadata.confidence === "verified",
    },
    type: "default",
    class: [
      "knowledge-flow-node",
      `knowledge-flow-node--${node.kind}`,
      selectedNodeId.value === node.id ? "is-selected" : "",
    ].join(" "),
  })),
);

const graphEdges = computed<Edge[]>(() =>
  (result.value?.edges ?? []).map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    label: edge.label,
    animated: edge.direction === "reverse",
    class: [
      "knowledge-flow-edge",
      edge.direction === "reverse" ? "knowledge-flow-edge--reverse" : "",
    ].join(" "),
  })),
);

const { fitView } = useVueFlow();

watch(
  () => result.value?.concept,
  async () => {
    await nextTick();
    fitView({ padding: 0.18, duration: 180 });
  },
);

function onNodeClick(event: { node: Node }) {
  selectNode(event.node.id);
}

function edgeLabel(edge: KnowledgeGraphEdge) {
  return `${edge.source} → ${edge.target}：${edge.label}`;
}

function nodeLabel(node: KnowledgeGraphNode) {
  return `${node.label} · ${node.kind}`;
}
</script>

<template>
  <div class="knowledge-graph-page">
    <AnimatedContent>
      <section class="knowledge-toolbar">
        <div>
          <span class="section-kicker">Knowledge Graph</span>
          <h1>把 API 放回源码关系网里理解</h1>
          <p>查看核心节点、直接依赖、反向依赖和数据流，点击节点读取源码元数据。</p>
        </div>
        <form class="knowledge-search-form" @submit.prevent="query()">
          <Search :size="19" />
          <InputText v-model="concept" aria-label="知识图谱概念" placeholder="例如：computed" />
          <Button type="submit" :disabled="!canSubmit">
            <LoaderCircle v-if="isLoading" class="spin" :size="17" />
            <span>{{ isLoading ? "查询中" : "生成图谱" }}</span>
          </Button>
        </form>
        <SelectButton
          :model-value="level"
          :options="levelOptions"
          option-label="label"
          option-value="value"
          :allow-empty="false"
          aria-label="图谱深度"
          @update:model-value="setLevel"
        />
      </section>
    </AnimatedContent>

    <Message v-if="error" severity="warn" :closable="false">{{ error }}</Message>

    <div v-if="isLoading && !result" class="knowledge-loading">
      <LoaderCircle class="spin" :size="28" />
      <strong>正在生成知识图谱</strong>
      <span>整理节点、依赖关系和源码引用...</span>
    </div>

    <template v-if="result">
      <div class="knowledge-layout">
        <AnimatedContent :delay="0.08">
          <section class="knowledge-graph-panel">
            <header>
              <div class="source-section-heading">
                <Network :size="20" />
                <h2>{{ result.concept }} 图谱</h2>
              </div>
              <span>{{ result.nodes.length }} nodes · {{ result.edges.length }} edges</span>
            </header>
            <VueFlow
              class="knowledge-flow"
              :style="{ width: '100%', height: '690px' }"
              :nodes="graphNodes"
              :edges="graphEdges"
              :nodes-draggable="false"
              :nodes-connectable="false"
              :elements-selectable="true"
              fit-view-on-init
              @node-click="onNodeClick"
            />
          </section>
        </AnimatedContent>

        <AnimatedContent :delay="0.12">
          <aside class="knowledge-side-panel">
            <section>
              <div class="source-section-heading">
                <Target :size="19" />
                <h2>核心解释</h2>
              </div>
              <p>{{ result.summary }}</p>
            </section>

            <section v-if="selectedNode">
              <div class="source-section-heading">
                <GitFork :size="19" />
                <h2>当前节点</h2>
              </div>
              <div class="knowledge-node-card">
                <span>{{ nodeLabel(selectedNode) }}</span>
                <strong>{{ selectedNode.summary }}</strong>
                <code>{{ selectedNode.metadata.filePath ?? selectedNode.metadata.symbol }}</code>
                <small>
                  {{ selectedNode.metadata.confidence === "verified" ? "源码已核对" : "解释性推断" }}
                  <template v-if="selectedNode.metadata.lines"> · {{ selectedNode.metadata.lines }}</template>
                </small>
                <a v-if="selectedNode.source" :href="selectedNode.source.url" target="_blank" rel="noreferrer">
                  GitHub 来源 <ArrowUpRight :size="15" />
                </a>
              </div>
            </section>

            <section>
              <div class="source-section-heading">
                <BookOpenCheck :size="19" />
                <h2>阅读路径</h2>
              </div>
              <ol class="knowledge-reading-path">
                <li v-for="item in result.readingPath" :key="item.nodeId">
                  <button type="button" @click="selectNode(item.nodeId)">
                    <strong>{{ result.nodes.find((node) => node.id === item.nodeId)?.label }}</strong>
                    <span>{{ item.reason }}</span>
                  </button>
                </li>
              </ol>
            </section>
          </aside>
        </AnimatedContent>
      </div>

      <div class="knowledge-info-grid">
        <AnimatedContent :delay="0.16">
          <section class="knowledge-info-panel">
            <h2>直接依赖</h2>
            <ul>
              <li v-for="item in result.directDependencies" :key="item">{{ item }}</li>
            </ul>
          </section>
        </AnimatedContent>

        <AnimatedContent :delay="0.2">
          <section class="knowledge-info-panel">
            <h2>反向依赖</h2>
            <ul>
              <li v-for="item in result.reverseDependencies" :key="item">{{ item }}</li>
            </ul>
          </section>
        </AnimatedContent>

        <AnimatedContent :delay="0.24">
          <section class="knowledge-info-panel">
            <h2>数据流</h2>
            <ol>
              <li v-for="item in result.dataFlow" :key="item">
                <ArrowRight :size="15" />
                <span>{{ item }}</span>
              </li>
            </ol>
          </section>
        </AnimatedContent>
      </div>

      <section class="knowledge-evidence-panel">
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
          <code>{{ reference.filePath ?? reference.version }}</code>
          <ArrowUpRight :size="17" />
        </a>
      </section>

      <section class="knowledge-edge-list">
        <span class="section-kicker">Relations</span>
        <button
          v-for="edge in result.edges"
          :key="edge.id"
          type="button"
          @click="selectNode(edge.target)"
        >
          {{ edgeLabel(edge) }}
        </button>
      </section>
    </template>
  </div>
</template>
