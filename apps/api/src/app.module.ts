import { Module } from "@nestjs/common";
import { HealthController } from "./health.controller.js";
import { ApiExplainerModule } from "./modules/api-explainer/api-explainer.module.js";
import { CallChainModule } from "./modules/call-chain/call-chain.module.js";
import { KnowledgeGraphModule } from "./modules/knowledge-graph/knowledge-graph.module.js";
import { LlmModule } from "./modules/llm/llm.module.js";
import { SourceReaderModule } from "./modules/source-reader/source-reader.module.js";

@Module({
  imports: [
    LlmModule,
    ApiExplainerModule,
    SourceReaderModule,
    CallChainModule,
    KnowledgeGraphModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
