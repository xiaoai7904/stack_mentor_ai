import { computed, onBeforeUnmount, ref } from "vue";
import type {
  ApiExplanation,
  LearnerLevel,
} from "@stack-mentor/types";
import { watchExplanation } from "@/data/watchExplanation";
import { explainApi } from "@/services/apiExplainer";

export function useApiExplainer() {
  const query = ref("watch");
  const level = ref<LearnerLevel>("intermediate");
  const result = ref<ApiExplanation>(watchExplanation);
  const isLoading = ref(false);
  const error = ref("");
  let controller: AbortController | null = null;

  const canSubmit = computed(
    () => query.value.trim().length > 0 && !isLoading.value,
  );

  async function analyze(api = query.value) {
    const normalizedApi = api.trim();
    if (!normalizedApi) return;

    query.value = normalizedApi;
    error.value = "";
    isLoading.value = true;
    controller?.abort();
    controller = new AbortController();

    try {
      result.value = await explainApi(
        { api: normalizedApi, level: level.value },
        controller.signal,
      );
    } catch (requestError) {
      if (requestError instanceof DOMException && requestError.name === "AbortError") {
        return;
      }

      if (normalizedApi.toLowerCase() === "watch") {
        result.value = { ...watchExplanation, level: level.value };
        error.value = "后端未连接，当前展示内置可验证样例。";
      } else {
        error.value =
          requestError instanceof Error
            ? requestError.message
            : "暂时无法生成解释，请稍后重试。";
      }
    } finally {
      isLoading.value = false;
    }
  }

  function setLevel(nextLevel: LearnerLevel) {
    level.value = nextLevel;
    result.value = { ...result.value, level: nextLevel };
  }

  onBeforeUnmount(() => controller?.abort());

  return {
    query,
    level,
    result,
    isLoading,
    error,
    canSubmit,
    analyze,
    setLevel,
  };
}
