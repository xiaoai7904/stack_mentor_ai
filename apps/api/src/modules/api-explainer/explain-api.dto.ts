import { IsIn, IsString, Matches } from "class-validator";
import type { LearnerLevel } from "@stack-mentor/types";

export class ExplainApiDto {
  @IsString()
  @Matches(/^[a-zA-Z][a-zA-Z0-9]*$/, {
    message: "api 只能包含 JavaScript 标识符字符",
  })
  api = "watch";

  @IsIn(["beginner", "intermediate", "advanced"])
  level: LearnerLevel = "intermediate";
}
