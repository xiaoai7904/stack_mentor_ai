import { Body, Controller, Post } from "@nestjs/common";
import type { CallChainAnalysisResult } from "@stack-mentor/types";
import { AnalyzeCallChainDto } from "./analyze-call-chain.dto.js";
import { CallChainService } from "./call-chain.service.js";

@Controller("call-chain")
export class CallChainController {
  constructor(private readonly callChainService: CallChainService) {}

  @Post("analyze")
  analyze(
    @Body() request: AnalyzeCallChainDto,
  ): CallChainAnalysisResult {
    return this.callChainService.analyze(request);
  }
}
