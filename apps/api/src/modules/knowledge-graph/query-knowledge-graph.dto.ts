import type { LearnerLevel } from "@stack-mentor/types";
import { IsIn, IsString, MinLength } from "class-validator";

export class QueryKnowledgeGraphDto {
  @IsString()
  @MinLength(2)
  concept!: string;

  @IsIn(["beginner", "intermediate", "advanced"])
  level!: LearnerLevel;
}
