<script setup lang="ts">
import {
  Bell,
  BookOpen,
  Boxes,
  Braces,
  ChevronRight,
  FlaskConical,
  GitBranch,
  Home,
  Menu,
  Network,
  Search,
  Settings,
  Sparkles,
  X,
} from "@lucide/vue";
import { computed, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const mobileOpen = ref(false);

const primaryItems = [
  { label: "学习工作台", to: "/", icon: Home },
  { label: "API 解释器", to: "/api-explainer", icon: Boxes },
  { label: "源码阅读助手", to: "/source-reader", icon: Braces },
  { label: "调用链分析", to: "/call-chain", icon: GitBranch },
  { label: "知识图谱", to: "/knowledge-graph", icon: Network },
  { label: "AI 实验室", to: "/ai-lab", icon: FlaskConical },
];

const pageTitle = computed(
  () => primaryItems.find((item) => item.to === route.path)?.label ?? "Stack Mentor AI",
);
</script>

<template>
  <div class="app-shell">
    <aside class="sidebar" :class="{ 'sidebar--open': mobileOpen }">
      <div class="brand">
        <div class="brand__mark"><Braces :size="24" /></div>
        <div>
          <strong>Stack Mentor AI</strong>
          <span>Expert Framework Mentor</span>
        </div>
        <button class="icon-button sidebar__close" aria-label="关闭导航" @click="mobileOpen = false">
          <X :size="20" />
        </button>
      </div>

      <nav class="nav-list" aria-label="主导航">
        <RouterLink
          v-for="item in primaryItems"
          :key="item.to"
          :to="item.to"
          class="nav-item"
          @click="mobileOpen = false"
        >
          <component :is="item.icon" :size="20" />
          <span>{{ item.label }}</span>
          <ChevronRight class="nav-item__arrow" :size="16" />
        </RouterLink>
      </nav>

      <div class="sidebar__footer">
        <div class="focus-panel">
          <Sparkles :size="20" />
          <div>
            <strong>当前学习主题</strong>
            <span>Vue3 响应式系统</span>
          </div>
        </div>
        <div class="profile">
          <div class="profile__avatar">SM</div>
          <div>
            <strong>源码学习者</strong>
            <span>MVP 体验版</span>
          </div>
          <Settings :size="18" />
        </div>
      </div>
    </aside>

    <div v-if="mobileOpen" class="sidebar-backdrop" @click="mobileOpen = false" />

    <main class="main-stage">
      <header class="topbar">
        <div class="topbar__title">
          <button class="icon-button mobile-menu" aria-label="打开导航" @click="mobileOpen = true">
            <Menu :size="21" />
          </button>
          <div>
            <span class="topbar__eyebrow">Vue3 学习空间</span>
            <strong>{{ pageTitle }}</strong>
          </div>
        </div>

        <div class="topbar__search">
          <Search :size="18" />
          <input aria-label="全局搜索" placeholder="搜索 API、源码路径或问题" />
          <kbd>⌘ K</kbd>
        </div>

        <nav class="topbar__links" aria-label="外部资源">
          <a href="https://vuejs.org/" target="_blank" rel="noreferrer">Docs</a>
          <a href="https://github.com/vuejs/core" target="_blank" rel="noreferrer">Vue3</a>
        </nav>

        <button class="icon-button notification-button" aria-label="通知">
          <Bell :size="20" />
          <span />
        </button>
      </header>

      <div class="page-scroll">
        <slot />
      </div>
    </main>
  </div>
</template>
