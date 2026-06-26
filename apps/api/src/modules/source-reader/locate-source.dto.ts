import type { LearnerLevel } from "@stack-mentor/types";
import { IsIn, IsString, MaxLength, MinLength } from "class-validator";

export class LocateSourceDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  topic = "Vue3 ref 原理";

  @IsIn(["beginner", "intermediate", "advanced"])
  level: LearnerLevel = "intermediate";
}
