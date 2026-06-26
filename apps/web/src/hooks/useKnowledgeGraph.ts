import type { KnowledgeGraphResult, LearnerLevel } from "@stack-mentor/types";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { queryKnowledgeGraph } from "@/services/knowledgeGraph";

export function useKnowledgeGraph() {
  const concept = ref("computed");
  const level = ref<LearnerLevel>("intermediate");
  const result = ref<KnowledgeGraphResult | null>(null);
  const selectedNodeId = ref("computed-api");
  const isLoading = ref(false);
  const error = ref("");
  let controller: AbortController | null = null;

  const canSubmit = computed(
    () => concept.value.trim().length >= 2 && !isLoading.value,
  );

  const selectedNode = computed(() =>
    result.value?.nodes.find((node) => node.id === selectedNodeId.value) ?? null,
  );

  async function query(nextConcept = concept.value) {
    const normalizedConcept = nextConcept.trim();
    if (normalizedConcept.length < 2) return;

    concept.value = normalizedConcept;
    error.value = "";
    isLoading.value = true;
    controller?.abort();
    controller = new AbortController();

    try {
      result.value = await queryKnowledgeGraph(
        { concept: normalizedConcept, level: level.value },
        controller.signal,
      );
      selectedNodeId.value = result.value.coreNodeId;
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
          : "暂时无法查询知识图谱，请稍后重试。";
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

  function selectNode(nodeId: string) {
    selectedNodeId.value = nodeId;
  }

  onMounted(() => void query());
  onBeforeUnmount(() => controller?.abort());

  return {
    concept,
    level,
    result,
    selectedNodeId,
    selectedNode,
    isLoading,
    error,
    canSubmit,
    query,
    setLevel,
    selectNode,
  };
}
