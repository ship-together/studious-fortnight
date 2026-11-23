export type ProjectStatus = 'Building' | 'Shipped' | 'Looking for Teammates';

export interface BuilderProject {
  id: string;
  title: string;
  summary: string;
  stack: string[];
  builderHandle: string;
  status: ProjectStatus;
  repoUrl?: string;
  votes: number;
  createdAt: string;
}

export interface CollabRequest {
  id: string;
  projectId: string;
  applicantHandle: string;
  role: string;
  note: string;
  createdAt: string;
}

export interface CreateProjectInput {
  title: string;
  summary: string;
  stack: string;
  builderHandle: string;
  status: ProjectStatus;
  repoUrl?: string;
}
