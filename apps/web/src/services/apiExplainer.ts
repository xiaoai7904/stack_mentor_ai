import type {
  ApiExplanation,
  ExplainApiRequest,
} from "@stack-mentor/types";

export async function explainApi(
  request: ExplainApiRequest,
  signal?: AbortSignal,
): Promise<ApiExplanation> {
  const response = await fetch("/api/explanations/api", {
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
    throw new Error(message ?? "API 解释请求失败");
  }

  const body = (await response.json()) as unknown;
  if (!isApiExplanation(body)) {
    throw new Error("服务返回了无法识别的解释结果");
  }

  return body;
}

function isApiExplanation(value: unknown): value is ApiExplanation {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<ApiExplanation>;
  return (
    typeof candidate.api === "string" &&
    typeof candidate.summary === "string" &&
    typeof candidate.signature === "string" &&
    Array.isArray(candidate.parameters) &&
    Array.isArray(candidate.callChain) &&
    Array.isArray(candidate.references) &&
    !!candidate.sourceLocation &&
    typeof candidate.sourceLocation.filePath === "string"
  );
}
