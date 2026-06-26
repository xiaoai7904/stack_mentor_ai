import type {
  KnowledgeGraphResult,
  QueryKnowledgeGraphRequest,
} from "@stack-mentor/types";

export async function queryKnowledgeGraph(
  request: QueryKnowledgeGraphRequest,
  signal?: AbortSignal,
): Promise<KnowledgeGraphResult> {
  const response = await fetch("/api/knowledge-graph/query", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
    signal,
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      message?: string | string[];
    } | null;
    const message = Array.isArray(body?.message)
      ? body.message.join("；")
      : body?.message;
    throw new Error(message ?? "知识图谱查询请求失败");
  }

  const body = (await response.json()) as unknown;
  if (!isKnowledgeGraphResult(body)) {
    throw new Error("服务返回了无法识别的知识图谱结果");
  }

  return body;
}

function isKnowledgeGraphResult(value: unknown): value is KnowledgeGraphResult {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<KnowledgeGraphResult>;
  return (
    typeof candidate.concept === "string" &&
    typeof candidate.summary === "string" &&
    typeof candidate.coreNodeId === "string" &&
    Array.isArray(candidate.nodes) &&
    Array.isArray(candidate.edges) &&
    Array.isArray(candidate.dataFlow) &&
    Array.isArray(candidate.readingPath)
  );
}
