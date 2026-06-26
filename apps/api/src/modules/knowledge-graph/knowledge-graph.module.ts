import { Module } from "@nestjs/common";
import { KnowledgeGraphController } from "./knowledge-graph.controller.js";
import { KnowledgeGraphService } from "./knowledge-graph.service.js";

@Module({
  controllers: [KnowledgeGraphController],
  providers: [KnowledgeGraphService],
})
export class KnowledgeGraphModule {}
