import { Body, Controller, Post } from "@nestjs/common";
import type { KnowledgeGraphResult } from "@stack-mentor/types";
import { KnowledgeGraphService } from "./knowledge-graph.service.js";
import { QueryKnowledgeGraphDto } from "./query-knowledge-graph.dto.js";

@Controller("knowledge-graph")
export class KnowledgeGraphController {
  constructor(private readonly knowledgeGraphService: KnowledgeGraphService) {}

  @Post("query")
  query(@Body() request: QueryKnowledgeGraphDto): KnowledgeGraphResult {
    return this.knowledgeGraphService.query(request);
  }
}
