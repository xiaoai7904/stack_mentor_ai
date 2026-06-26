<script setup lang="ts">
import { Check, Copy } from "@lucide/vue";
import { ref } from "vue";

const props = defineProps<{
  code: string;
  language?: string;
}>();

const copied = ref(false);

async function copyCode() {
  await navigator.clipboard.writeText(props.code);
  copied.value = true;
  window.setTimeout(() => {
    copied.value = false;
  }, 1600);
}
</script>

<template>
  <div class="code-block">
    <div class="code-block__toolbar">
      <span>{{ language ?? "TypeScript" }}</span>
      <button type="button" @click="copyCode">
        <Check v-if="copied" :size="15" />
        <Copy v-else :size="15" />
        {{ copied ? "已复制" : "复制" }}
      </button>
    </div>
    <pre><code>{{ code }}</code></pre>
  </div>
</template>
