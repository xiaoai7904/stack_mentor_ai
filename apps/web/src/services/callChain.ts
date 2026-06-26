import type {
  AnalyzeCallChainRequest,
  CallChainAnalysisResult,
} from "@stack-mentor/types";

export async function analyzeCallChain(
  request: AnalyzeCallChainRequest,
  signal?: AbortSignal,
): Promise<CallChainAnalysisResult> {
  const response = await fetch("/api/call-chain/analyze", {
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
    throw new Error(message ?? "调用链分析请求失败");
  }

  const body = (await response.json()) as unknown;
  if (!isCallChainAnalysisResult(body)) {
    throw new Error("服务返回了无法识别的调用链分析结果");
  }

  return body;
}

function isCallChainAnalysisResult(
  value: unknown,
): value is CallChainAnalysisResult {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<CallChainAnalysisResult>;
  return (
    typeof candidate.snippet === "string" &&
    typeof candidate.summary === "string" &&
    Array.isArray(candidate.syncFlow) &&
    Array.isArray(candidate.reactiveFlow) &&
    Array.isArray(candidate.schedulerFlow) &&
    Array.isArray(candidate.steps) &&
    Array.isArray(candidate.edges) &&
    Array.isArray(candidate.sourceFiles)
  );
}
