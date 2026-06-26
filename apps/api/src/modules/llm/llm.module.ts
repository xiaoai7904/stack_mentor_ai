import { Module } from "@nestjs/common";
import { LLM_PROVIDER } from "./llm-provider.js";
import { MockLlmProvider } from "./mock-llm.provider.js";

@Module({
  providers: [
    MockLlmProvider,
    {
      provide: LLM_PROVIDER,
      useExisting: MockLlmProvider,
    },
  ],
  exports: [LLM_PROVIDER],
})
export class LlmModule {}
