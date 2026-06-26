<script setup lang="ts">
import { Construction } from "@lucide/vue";
import AnimatedContent from "@/components/motion/AnimatedContent.vue";

defineProps<{
  title: string;
  accent: string;
}>();
</script>

<template>
  <div class="placeholder-page">
    <AnimatedContent>
      <div class="placeholder-panel" :data-accent="accent">
        <Construction :size="28" />
        <span class="section-kicker">MVP 下一步</span>
        <h1>{{ title }}</h1>
        <p>页面骨架和业务 hook 已建立，将按计划在后续纵向迭代中接入真实分析流程。</p>
      </div>
    </AnimatedContent>
  </div>
</template>
