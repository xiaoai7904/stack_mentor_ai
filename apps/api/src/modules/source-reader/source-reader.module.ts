import { Module } from "@nestjs/common";
import { SourceReaderController } from "./source-reader.controller.js";
import { SourceReaderService } from "./source-reader.service.js";

@Module({
  controllers: [SourceReaderController],
  providers: [SourceReaderService],
})
export class SourceReaderModule {}
