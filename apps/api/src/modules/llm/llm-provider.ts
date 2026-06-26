export interface LlmMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface LlmProvider {
  generate(messages: LlmMessage[]): Promise<string>;
}

export const LLM_PROVIDER = Symbol("LLM_PROVIDER");
