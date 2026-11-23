import { BuilderProject, CollabRequest, CreateProjectInput } from './types';

const BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';

async function parseResponse<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error || `Request failed with status ${res.status}`);
  }
  return data as T;
}

export async function fetchProjects(query?: string, status?: string): Promise<BuilderProject[]> {
  const params = new URLSearchParams();
  if (query) params.set('q', query);
  if (status && status !== 'All') params.set('status', status);
  const qs = params.toString();
  const res = await fetch(`${BASE}/projects${qs ? `?${qs}` : ''}`);
  const data = await parseResponse<{ projects: BuilderProject[] }>(res);
  return data.projects;
}

export async function createProject(payload: CreateProjectInput): Promise<BuilderProject> {
  const res = await fetch(`${BASE}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await parseResponse<{ project: BuilderProject }>(res);
  return data.project;
}

export async function upvoteProject(id: string): Promise<BuilderProject> {
  const res = await fetch(`${BASE}/projects/${encodeURIComponent(id)}/upvote`, {
    method: 'POST',
  });
  const data = await parseResponse<{ project: BuilderProject }>(res);
  return data.project;
}

export async function deleteProject(id: string): Promise<void> {
  const res = await fetch(`${BASE}/projects/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
  await parseResponse<{ deleted: boolean }>(res);
}

export async function fetchCollabs(projectId?: string): Promise<CollabRequest[]> {
  const qs = projectId ? `?projectId=${encodeURIComponent(projectId)}` : '';
  const res = await fetch(`${BASE}/collabs${qs}`);
  const data = await parseResponse<{ collabs: CollabRequest[] }>(res);
  return data.collabs;
}

export async function submitCollabRequest(input: {
  projectId: string;
  applicantHandle: string;
  role: string;
  note: string;
}): Promise<CollabRequest> {
  const res = await fetch(`${BASE}/collabs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const data = await parseResponse<{ collab: CollabRequest }>(res);
  return data.collab;
}
