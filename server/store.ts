export interface BuilderProject {
  id: string;
  title: string;
  summary: string;
  stack: string[];
  builderHandle: string;
  status: 'Building' | 'Shipped' | 'Looking for Teammates';
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

class BuilderStore {
  private projects: BuilderProject[] = [
    {
      id: 'proj-1',
      title: 'Smart Contract Gas & Risk Scanner',
      summary: 'Static check pipeline for Solidity contracts with instant severity tags and fix suggestions.',
      stack: ['Solidity', 'TypeScript', 'Next.js'],
      builderHandle: '@fathiaomar',
      status: 'Shipped',
      repoUrl: 'https://github.com/ship-together/studious-fortnight',
      votes: 14,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'proj-2',
      title: 'Weekend Sprint Matchmaker',
      summary: 'Pair up builders by timezone, stack, and shipping goal for 48-hour builds.',
      stack: ['React', 'Node.js', 'Tailwind'],
      builderHandle: '@ship-together',
      status: 'Looking for Teammates',
      repoUrl: 'https://github.com/ship-together/community-builds',
      votes: 9,
      createdAt: new Date().toISOString(),
    },
  ];

  private collabs: CollabRequest[] = [];

  listProjects(query?: string, status?: string): BuilderProject[] {
    return this.projects
      .filter((p) => {
        const matchesStatus = !status || status === 'All' || p.status === status;
        const q = (query || '').trim().toLowerCase();
        const matchesQuery =
          !q ||
          p.title.toLowerCase().includes(q) ||
          p.summary.toLowerCase().includes(q) ||
          p.stack.some((s) => s.toLowerCase().includes(q)) ||
          p.builderHandle.toLowerCase().includes(q);
        return matchesStatus && matchesQuery;
      })
      .sort((a, b) => b.votes - a.votes);
  }

  createProject(input: Omit<BuilderProject, 'id' | 'votes' | 'createdAt'>): BuilderProject {
    const project: BuilderProject = {
      ...input,
      id: `proj-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      votes: 1,
      createdAt: new Date().toISOString(),
    };
    this.projects.unshift(project);
    return project;
  }

  upvoteProject(id: string): BuilderProject | null {
    const found = this.projects.find((p) => p.id === id);
    if (!found) return null;
    found.votes += 1;
    return found;
  }

  deleteProject(id: string): boolean {
    const before = this.projects.length;
    this.projects = this.projects.filter((p) => p.id !== id);
    return this.projects.length < before;
  }

  listCollabs(projectId?: string): CollabRequest[] {
    if (!projectId) return this.collabs;
    return this.collabs.filter((c) => c.projectId === projectId);
  }

  addCollab(input: Omit<CollabRequest, 'id' | 'createdAt'>): CollabRequest {
    const entry: CollabRequest = {
      ...input,
      id: `collab-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.collabs.unshift(entry);
    return entry;
  }
}

export const store = new BuilderStore();
