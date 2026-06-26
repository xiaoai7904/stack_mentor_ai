<script setup lang="ts">
import { ArrowDown, CircleDot, Clock3, Radio, Workflow } from "@lucide/vue";

defineProps<{
  steps: string[];
}>();

const icons = [CircleDot, Radio, Workflow, Clock3, CircleDot];
</script>

<template>
  <aside class="call-chain-panel">
    <div class="panel-heading panel-heading--compact">
      <div>
        <span class="section-kicker">运行时视角</span>
        <h2>原理流程</h2>
      </div>
      <Workflow :size="21" />
    </div>
    <div class="call-chain">
      <template v-for="(step, index) in steps" :key="step">
        <div class="call-chain__step" :class="`call-chain__step--${index + 1}`">
          <component :is="icons[index]" :size="18" />
          <span>{{ step }}</span>
        </div>
        <ArrowDown v-if="index < steps.length - 1" class="call-chain__arrow" :size="18" />
      </template>
    </div>
    <p class="call-chain__note">
      关键点：依赖通知并不等于立即执行回调，scheduler 会根据 flush 选项决定 job 的时机。
    </p>
  </aside>
</template>
