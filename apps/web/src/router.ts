import { createRouter, createWebHistory } from "vue-router";
import ApiExplainerPage from "@/pages/ApiExplainerPage.vue";
import DashboardPage from "@/pages/DashboardPage.vue";
import PlaceholderPage from "@/pages/PlaceholderPage.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "dashboard", component: DashboardPage },
    {
      path: "/api-explainer",
      name: "api-explainer",
      component: ApiExplainerPage,
    },
    {
      path: "/source-reader",
      name: "source-reader",
      component: () => import("@/pages/SourceReaderPage.vue"),
    },
    {
      path: "/call-chain",
      name: "call-chain",
      component: () => import("@/pages/CallChainPage.vue"),
    },
    {
      path: "/knowledge-graph",
      name: "knowledge-graph",
      component: () => import("@/pages/KnowledgeGraphPage.vue"),
    },
    {
      path: "/ai-lab",
      name: "ai-lab",
      component: PlaceholderPage,
      props: { title: "AI 实验室", accent: "teal" },
    },
  ],
});

export default router;
