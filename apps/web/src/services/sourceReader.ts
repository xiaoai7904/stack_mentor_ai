import type {
  LocateSourceRequest,
  SourceReadingResult,
} from "@stack-mentor/types";

export async function locateSource(
  request: LocateSourceRequest,
  signal?: AbortSignal,
): Promise<SourceReadingResult> {
  const response = await fetch("/api/source/locate", {
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
    throw new Error(message ?? "源码定位请求失败");
  }

  const body = (await response.json()) as unknown;
  if (!isSourceReadingResult(body)) {
    throw new Error("服务返回了无法识别的源码分析结果");
  }

  return body;
}

function isSourceReadingResult(value: unknown): value is SourceReadingResult {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<SourceReadingResult>;
  return (
    typeof candidate.topic === "string" &&
    typeof candidate.summary === "string" &&
    !!candidate.file &&
    typeof candidate.file.content === "string" &&
    typeof candidate.file.filePath === "string" &&
    Array.isArray(candidate.keySymbols) &&
    Array.isArray(candidate.readingOrder) &&
    Array.isArray(candidate.callChain)
  );
}
