import { Body, Controller, Post } from "@nestjs/common";
import { LocateSourceDto } from "./locate-source.dto.js";
import { SourceReaderService } from "./source-reader.service.js";

@Controller("source")
export class SourceReaderController {
  constructor(private readonly sourceReaderService: SourceReaderService) {}

  @Post("locate")
  locate(@Body() request: LocateSourceDto) {
    return this.sourceReaderService.locate(request);
  }
}
