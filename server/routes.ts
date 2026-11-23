import { Router, Request, Response } from 'express';
import { store, BuilderProject } from './store.js';

export const apiRouter = Router();

apiRouter.get('/health', (_req: Request, res: Response) => {
  res.json({ ok: true, repo: 'studious-fortnight', org: 'ship-together' });
});

apiRouter.get('/projects', (req: Request, res: Response) => {
  const q = typeof req.query.q === 'string' ? req.query.q : undefined;
  const status = typeof req.query.status === 'string' ? req.query.status : undefined;
  const items = store.listProjects(q, status);
  res.json({ projects: items, total: items.length });
});

apiRouter.post('/projects', (req: Request, res: Response) => {
  const { title, summary, stack, builderHandle, status, repoUrl } = req.body ?? {};

  if (!title || typeof title !== 'string' || !title.trim()) {
    res.status(400).json({ error: 'Project title is required.' });
    return;
  }
  if (!summary || typeof summary !== 'string' || !summary.trim()) {
    res.status(400).json({ error: 'Project summary is required.' });
    return;
  }

  const normalizedStack: string[] = Array.isArray(stack)
    ? stack.map((s) => String(s).trim()).filter(Boolean)
    : typeof stack === 'string'
      ? stack.split(',').map((s) => s.trim()).filter(Boolean)
      : ['TypeScript'];

  const allowedStatuses: BuilderProject['status'][] = [
    'Building',
    'Shipped',
    'Looking for Teammates',
  ];
  const safeStatus: BuilderProject['status'] = allowedStatuses.includes(status)
    ? status
    : 'Building';

  const created = store.createProject({
    title: title.trim(),
    summary: summary.trim(),
    stack: normalizedStack.length ? normalizedStack : ['TypeScript'],
    builderHandle:
      typeof builderHandle === 'string' && builderHandle.trim()
        ? builderHandle.trim().startsWith('@')
          ? builderHandle.trim()
          : `@${builderHandle.trim()}`
        : '@builder',
    status: safeStatus,
    repoUrl: typeof repoUrl === 'string' && repoUrl.trim() ? repoUrl.trim() : undefined,
  });

  res.status(201).json({ project: created });
});

apiRouter.post('/projects/:id/upvote', (req: Request, res: Response) => {
  const updated = store.upvoteProject(req.params.id);
  if (!updated) {
    res.status(404).json({ error: 'Project not found.' });
    return;
  }
  res.json({ project: updated });
});

apiRouter.delete('/projects/:id', (req: Request, res: Response) => {
  const removed = store.deleteProject(req.params.id);
  if (!removed) {
    res.status(404).json({ error: 'Project not found.' });
    return;
  }
  res.json({ deleted: true, id: req.params.id });
});

apiRouter.get('/collabs', (req: Request, res: Response) => {
  const projectId = typeof req.query.projectId === 'string' ? req.query.projectId : undefined;
  res.json({ collabs: store.listCollabs(projectId) });
});

apiRouter.post('/collabs', (req: Request, res: Response) => {
  const { projectId, applicantHandle, role, note } = req.body ?? {};
  if (!projectId || !applicantHandle || !role) {
    res.status(400).json({ error: 'projectId, applicantHandle, and role are required.' });
    return;
  }

  const created = store.addCollab({
    projectId: String(projectId),
    applicantHandle: String(applicantHandle).trim(),
    role: String(role).trim(),
    note: typeof note === 'string' ? note.trim() : '',
  });

  res.status(201).json({ collab: created });
});
