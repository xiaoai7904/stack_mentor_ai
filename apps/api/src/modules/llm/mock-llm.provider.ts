import { Injectable } from "@nestjs/common";
import type { LlmMessage, LlmProvider } from "./llm-provider.js";

@Injectable()
export class MockLlmProvider implements LlmProvider {
  async generate(_messages: LlmMessage[]): Promise<string> {
    throw new Error(
      "当前使用本地示例数据。配置 LLM_PROVIDER 和对应 API Key 后启用模型生成。",
    );
  }
}
