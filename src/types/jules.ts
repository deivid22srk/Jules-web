export interface Source {
  name: string;
  id: string;
  githubRepo?: {
    owner: string;
    repo: string;
  };
}

export interface Session {
  name: string;
  id: string;
  title: string;
  sourceContext: {
    source: string;
    githubRepoContext?: {
      startingBranch: string;
    };
  };
  prompt: string;
  outputs?: {
    pullRequest?: {
      url: string;
      title: string;
      description: string;
    };
  }[];
}

export interface Activity {
  name: string;
  id: string;
  createTime: string;
  originator: 'agent' | 'user';
  planGenerated?: {
    plan: {
      id: string;
      steps: PlanStep[];
    };
  };
  planApproved?: {
    planId: string;
  };
  progressUpdated?: {
    title: string;
    description?: string;
  };
  messageSent?: {
    prompt: string;
  };
  messageReceived?: {
    message: string;
  };
  sessionCompleted?: Record<string, never>;
  artifacts?: Artifact[];
}

export interface PlanStep {
  id: string;
  title: string;
  index?: number;
}

export interface Artifact {
  bashOutput?: {
    command?: string;
    output?: string;
    exitCode?: number;
  };
  changeSet?: {
    source: string;
    gitPatch?: {
      unidiffPatch?: string;
      baseCommitId?: string;
      suggestedCommitMessage?: string;
    };
  };
  media?: {
    data: string;
    mimeType: string;
  };
}

export interface CreateSessionRequest {
  prompt: string;
  sourceContext: {
    source: string;
    githubRepoContext?: {
      startingBranch: string;
    };
  };
  automationMode?: 'AUTO_CREATE_PR' | 'NONE';
  title: string;
  requirePlanApproval?: boolean;
}
