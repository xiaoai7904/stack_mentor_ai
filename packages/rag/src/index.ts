import type { SourceReference } from "@stack-mentor/types";

export interface RetrievedEvidence {
  content: string;
  score: number;
  source: SourceReference;
}

export interface KnowledgeRetriever {
  retrieve(query: string, limit?: number): Promise<RetrievedEvidence[]>;
}
