<script setup lang="ts">
import type { Component } from "vue";

defineProps<{
  title: string;
  description: string;
  to: string;
  icon: Component;
  tone: "teal" | "purple" | "blue" | "indigo" | "amber";
}>();
</script>

<template>
  <RouterLink :to="to" class="feature-tile" :class="`feature-tile--${tone}`">
    <div class="feature-tile__icon">
      <component :is="icon" :size="22" />
    </div>
    <div>
      <h3>{{ title }}</h3>
      <p>{{ description }}</p>
    </div>
    <span class="feature-tile__action">进入工具</span>
  </RouterLink>
</template>
