import type { LearnerLevel } from "@stack-mentor/types";
import { IsIn, IsString, MinLength } from "class-validator";

export class AnalyzeCallChainDto {
  @IsString()
  @MinLength(3)
  snippet!: string;

  @IsIn(["beginner", "intermediate", "advanced"])
  level!: LearnerLevel;
}
