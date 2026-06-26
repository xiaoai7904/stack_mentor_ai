import { Body, Controller, Post } from "@nestjs/common";
import { ApiExplainerService } from "./api-explainer.service.js";
import { ExplainApiDto } from "./explain-api.dto.js";

@Controller("explanations")
export class ApiExplainerController {
  constructor(private readonly apiExplainerService: ApiExplainerService) {}

  @Post("api")
  explain(@Body() request: ExplainApiDto) {
    return this.apiExplainerService.explain(request);
  }
}
