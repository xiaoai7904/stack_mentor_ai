export type LearnerLevel = "beginner" | "intermediate" | "advanced";

export interface SourceReference {
  title: string;
  sourceType: "official-doc" | "source-code" | "rfc" | "issue" | "pr";
  url: string;
  repository?: string;
  filePath?: string;
  version?: string;
  commit?: string;
  symbol?: string;
}

export interface ApiExplanation {
  api: string;
  level: LearnerLevel;
  summary: string;
  signature: string;
  parameters: Array<{ name: string; description: string }>;
  returns: string;
  useCases: string[];
  example: string;
  commonMistakes: string[];
  performanceNotes: string[];
  designMotivation: string;
  sourceLocation: {
    filePath: string;
    symbols: string[];
    readingOrder: string[];
  };
  callChain: string[];
  relatedApis: string[];
  references: SourceReference[];
  evidenceNotice?: string;
}

export interface ExplainApiRequest {
  api: string;
  level: LearnerLevel;
}

export interface SourceReadingResult {
  topic: string;
  level: LearnerLevel;
  summary: string;
  designMotivation: string;
  file: {
    repository: string;
    filePath: string;
    version: string;
    commit: string;
    language: string;
    startLine: number;
    endLine: number;
    content: string;
    url: string;
  };
  keySymbols: Array<{
    name: string;
    kind: "function" | "class" | "method" | "field";
    line: number;
    description: string;
  }>;
  readingOrder: Array<{
    filePath: string;
    symbol: string;
    reason: string;
  }>;
  callChain: string[];
  prerequisites: string[];
  exercise: {
    title: string;
    code: string;
    expected: string;
  };
  references: SourceReference[];
  evidenceNotice?: string;
}

export interface LocateSourceRequest {
  topic: string;
  level: LearnerLevel;
}

export interface CallChainStep {
  id: string;
  title: string;
  category: "sync" | "reactivity" | "scheduler" | "result";
  sourceFile: string;
  sourceLines: string;
  summary: string;
  detail: string;
}

export interface CallChainEdge {
  from: string;
  to: string;
  label: string;
}

export interface CallChainAnalysisResult {
  snippet: string;
  level: LearnerLevel;
  triggerStatement: string;
  visibleResult: string;
  summary: string;
  syncFlow: string[];
  reactiveFlow: string[];
  schedulerFlow: string[];
  steps: CallChainStep[];
  edges: CallChainEdge[];
  sourceFiles: Array<{
    repository: string;
    filePath: string;
    version: string;
    commit: string;
    url: string;
    symbols: string[];
  }>;
  designMotivation: string;
  evidenceNotice?: string;
}

export interface AnalyzeCallChainRequest {
  snippet: string;
  level: LearnerLevel;
}

export interface KnowledgeGraphNode {
  id: string;
  label: string;
  kind: "api" | "class" | "function" | "concept" | "source-file";
  summary: string;
  source?: SourceReference;
  metadata: {
    packageName?: string;
    filePath?: string;
    symbol?: string;
    lines?: string;
    confidence: "verified" | "inferred";
  };
}

export interface KnowledgeGraphEdge {
  id: string;
  source: string;
  target: string;
  relation:
    | "creates"
    | "reads"
    | "tracks"
    | "triggers"
    | "depends-on"
    | "invalidates"
    | "refreshes"
    | "located-in";
  label: string;
  direction: "forward" | "reverse";
}

export interface KnowledgeGraphResult {
  concept: string;
  level: LearnerLevel;
  summary: string;
  coreNodeId: string;
  nodes: KnowledgeGraphNode[];
  edges: KnowledgeGraphEdge[];
  directDependencies: string[];
  reverseDependencies: string[];
  dataFlow: string[];
  readingPath: Array<{
    nodeId: string;
    reason: string;
  }>;
  references: SourceReference[];
  evidenceNotice?: string;
}

export interface QueryKnowledgeGraphRequest {
  concept: string;
  level: LearnerLevel;
}
