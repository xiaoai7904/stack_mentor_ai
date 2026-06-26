import type {
  LearnerLevel,
  SourceReadingResult,
} from "@stack-mentor/types";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { locateSource } from "@/services/sourceReader";

export function useSourceReader() {
  const topic = ref("Vue3 ref 原理");
  const level = ref<LearnerLevel>("intermediate");
  const result = ref<SourceReadingResult | null>(null);
  const isLoading = ref(false);
  const error = ref("");
  let controller: AbortController | null = null;

  const canSubmit = computed(
    () => topic.value.trim().length >= 2 && !isLoading.value,
  );

  async function analyze(nextTopic = topic.value) {
    const normalizedTopic = nextTopic.trim();
    if (normalizedTopic.length < 2) return;

    topic.value = normalizedTopic;
    error.value = "";
    isLoading.value = true;
    controller?.abort();
    controller = new AbortController();

    try {
      result.value = await locateSource(
        { topic: normalizedTopic, level: level.value },
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
          : "暂时无法定位源码，请稍后重试。";
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
    topic,
    level,
    result,
    isLoading,
    error,
    canSubmit,
    analyze,
    setLevel,
  };
}
