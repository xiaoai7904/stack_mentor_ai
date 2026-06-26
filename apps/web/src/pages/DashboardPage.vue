<script setup lang="ts">
import {
  ArrowRight,
  Boxes,
  Braces,
  CheckCircle2,
  FlaskConical,
  GitBranch,
  Network,
  Search,
} from "@lucide/vue";
import Button from "primevue/button";
import { useRouter } from "vue-router";
import FeatureTile from "@/components/dashboard/FeatureTile.vue";
import AnimatedContent from "@/components/motion/AnimatedContent.vue";

const router = useRouter();

const features = [
  {
    title: "API 解释器",
    description: "从用法深入到设计动机、源码入口与性能取舍。",
    to: "/api-explainer",
    icon: Boxes,
    tone: "teal" as const,
  },
  {
    title: "源码阅读助手",
    description: "定位关键文件、函数与推荐阅读顺序。",
    to: "/source-reader",
    icon: Braces,
    tone: "purple" as const,
  },
  {
    title: "调用链分析",
    description: "区分同步触发、异步调度与最终渲染结果。",
    to: "/call-chain",
    icon: GitBranch,
    tone: "blue" as const,
  },
  {
    title: "知识图谱",
    description: "理解概念之间的依赖、数据流与架构关系。",
    to: "/knowledge-graph",
    icon: Network,
    tone: "indigo" as const,
  },
  {
    title: "AI 实验室",
    description: "运行最小示例，验证响应式系统行为。",
    to: "/ai-lab",
    icon: FlaskConical,
    tone: "amber" as const,
  },
];
</script>

<template>
  <div class="dashboard-page">
    <AnimatedContent>
      <section class="dashboard-hero">
        <div>
          <span class="section-kicker">Vue3 源码学习工作台</span>
          <h1>今天想弄懂哪个“为什么”？</h1>
          <p>
            从 API 用法出发，继续追踪设计动机、源码入口、执行流程和工程取舍。
          </p>
        </div>
        <div class="hero-search">
          <Search :size="20" />
          <input value="watch 为什么需要 flush 选项？" aria-label="提问" />
          <Button label="开始分析" @click="router.push('/api-explainer')" />
        </div>
      </section>
    </AnimatedContent>

    <AnimatedContent :delay="0.08">
      <section class="feature-grid" aria-label="核心学习工具">
        <FeatureTile v-for="feature in features" :key="feature.title" v-bind="feature" />
      </section>
    </AnimatedContent>

    <section class="dashboard-grid">
      <AnimatedContent :delay="0.12">
        <div class="workspace-panel recent-panel">
          <div class="panel-heading">
            <div>
              <span class="section-kicker">继续学习</span>
              <h2>最近使用</h2>
            </div>
            <RouterLink to="/api-explainer">查看全部 <ArrowRight :size="16" /></RouterLink>
          </div>
          <RouterLink to="/api-explainer" class="recent-item">
            <span class="recent-item__index">01</span>
            <div>
              <strong>watch 的调度与清理机制</strong>
              <span>API 解释器 · 10 分钟前</span>
            </div>
            <ArrowRight :size="18" />
          </RouterLink>
          <RouterLink to="/source-reader" class="recent-item">
            <span class="recent-item__index">02</span>
            <div>
              <strong>ref 如何追踪和触发依赖</strong>
              <span>源码阅读助手 · 2 小时前</span>
            </div>
            <ArrowRight :size="18" />
          </RouterLink>
          <RouterLink to="/call-chain" class="recent-item">
            <span class="recent-item__index">03</span>
            <div>
              <strong>count.value++ 完整调用链</strong>
              <span>调用链分析 · 昨天</span>
            </div>
            <ArrowRight :size="18" />
          </RouterLink>
        </div>
      </AnimatedContent>

      <AnimatedContent :delay="0.16">
        <div class="workspace-panel progress-panel">
          <div class="panel-heading">
            <div>
              <span class="section-kicker">当前路径</span>
              <h2>Vue3 响应式系统</h2>
            </div>
            <strong class="progress-value">38%</strong>
          </div>
          <div class="progress-track"><span /></div>
          <div class="progress-list">
            <div><CheckCircle2 :size="18" /> ref 与 reactive <span>已完成</span></div>
            <div><CheckCircle2 :size="18" /> effect 依赖收集 <span>学习中</span></div>
            <div class="is-pending"><CheckCircle2 :size="18" /> scheduler 调度 <span>待学习</span></div>
          </div>
        </div>
      </AnimatedContent>
    </section>
  </div>
</template>
