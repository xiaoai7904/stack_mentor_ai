import type {
  CallChainAnalysisResult,
  LearnerLevel,
} from "@stack-mentor/types";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { analyzeCallChain } from "@/services/callChain";

export function useCallChainAnalysis() {
  const snippet = ref(`const count = ref(0)

watch(count, (newValue, oldValue) => {
  console.log(newValue, oldValue)
})

count.value++`);
  const level = ref<LearnerLevel>("intermediate");
  const result = ref<CallChainAnalysisResult | null>(null);
  const isLoading = ref(false);
  const error = ref("");
  let controller: AbortController | null = null;

  const canSubmit = computed(
    () => snippet.value.trim().length >= 3 && !isLoading.value,
  );

  async function analyze(nextSnippet = snippet.value) {
    const normalizedSnippet = nextSnippet.trim();
    if (normalizedSnippet.length < 3) return;

    snippet.value = normalizedSnippet;
    error.value = "";
    isLoading.value = true;
    controller?.abort();
    controller = new AbortController();

    try {
      result.value = await analyzeCallChain(
        { snippet: normalizedSnippet, level: level.value },
        controller.signal,
      );
    } catch (requestError) {
      if (
        requestError instanceof DOMException &&
        requestError.name === "AbortError"
      ) {
        return;
      }

      error.value =
        requestError instanceof Error
          ? requestError.message
          : "暂时无法分析调用链，请稍后重试。";
    } finally {
      isLoading.value = false;
    }
  }

  function setLevel(nextLevel: LearnerLevel) {
    level.value = nextLevel;
    if (result.value) {
      result.value = { ...result.value, level: nextLevel };
    }
  }

  onMounted(() => void analyze());
  onBeforeUnmount(() => controller?.abort());

  return {
    snippet,
    level,
    result,
    isLoading,
    error,
    canSubmit,
    analyze,
    setLevel,
  };
}
