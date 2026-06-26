import { Module } from "@nestjs/common";
import { LlmModule } from "../llm/llm.module.js";
import { ApiExplainerController } from "./api-explainer.controller.js";
import { ApiExplainerService } from "./api-explainer.service.js";

@Module({
  imports: [LlmModule],
  controllers: [ApiExplainerController],
  providers: [ApiExplainerService],
})
export class ApiExplainerModule {}
