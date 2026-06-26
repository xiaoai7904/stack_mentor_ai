import { Module } from "@nestjs/common";
import { CallChainController } from "./call-chain.controller.js";
import { CallChainService } from "./call-chain.service.js";

@Module({
  controllers: [CallChainController],
  providers: [CallChainService],
})
export class CallChainModule {}
