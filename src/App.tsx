import React, { useEffect, useState } from 'react';
import {
  ArrowBigUp,
  FolderGit2,
  Plus,
  Search,
  Trash2,
  Users,
  ExternalLink,
} from 'lucide-react';
import {
  createProject,
  deleteProject,
  fetchCollabs,
  fetchProjects,
  submitCollabRequest,
  upvoteProject,
} from './api';
import { BuilderProject, CollabRequest, ProjectStatus } from './types';

const STATUS_OPTIONS: Array<'All' | ProjectStatus> = [
  'All',
  'Looking for Teammates',
  'Building',
  'Shipped',
];

export default function App() {
  const [projects, setProjects] = useState<BuilderProject[]>([]);
  const [collabs, setCollabs] = useState<CollabRequest[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | ProjectStatus>('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [stack, setStack] = useState('TypeScript, React, Solidity');
  const [builderHandle, setBuilderHandle] = useState('@fathiaomar');
  const [status, setStatus] = useState<ProjectStatus>('Looking for Teammates');
  const [repoUrl, setRepoUrl] = useState('https://github.com/ship-together/studious-fortnight');
  const [submitting, setSubmitting] = useState(false);

  const [activeJoinProjectId, setActiveJoinProjectId] = useState<string | null>(null);
  const [applicantHandle, setApplicantHandle] = useState('');
  const [role, setRole] = useState('Frontend / Smart Contracts');
  const [note, setNote] = useState('');

  async function loadAll(q = search, st = statusFilter) {
    setLoading(true);
    setError(null);
    try {
      const [projList, collabList] = await Promise.all([
        fetchProjects(q, st),
        fetchCollabs(),
      ]);
      setProjects(projList);
      setCollabs(collabList);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, [statusFilter]);

  async function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    await loadAll(search, statusFilter);
  }

  async function handleCreateProject(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !summary.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      await createProject({
        title,
        summary,
        stack,
        builderHandle,
        status,
        repoUrl,
      });
      setTitle('');
      setSummary('');
      setShowCreateForm(false);
      await loadAll(search, statusFilter);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create project.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpvote(id: string) {
    try {
      await upvoteProject(id);
      await loadAll(search, statusFilter);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not upvote.');
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteProject(id);
      await loadAll(search, statusFilter);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete project.');
    }
  }

  async function handleJoinSubmit(e: React.FormEvent, projectId: string) {
    e.preventDefault();
    if (!applicantHandle.trim() || !role.trim()) return;
    try {
      await submitCollabRequest({
        projectId,
        applicantHandle,
        role,
        note,
      });
      setApplicantHandle('');
      setNote('');
      setActiveJoinProjectId(null);
      await loadAll(search, statusFilter);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not submit request.');
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/70 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <div className="flex items-center gap-3">
            <FolderGit2 className="h-6 w-6 text-cyan-400" />
            <div>
              <h1 className="text-lg font-bold tracking-tight">Ship Together</h1>
              <p className="text-xs text-slate-400">ship-together / studious-fortnight</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowCreateForm((v) => !v)}
            className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-3.5 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400"
          >
            <Plus className="h-4 w-4" />
            {showCreateForm ? 'Close Form' : 'Post Project'}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 px-4 py-6">
        {error && (
          <div className="rounded-lg border border-red-500/40 bg-red-950/50 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {showCreateForm && (
          <form
            onSubmit={handleCreateProject}
            className="space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-5"
          >
            <h2 className="text-base font-semibold text-white">Add a Builder Project</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                required
                placeholder="Project title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
              />
              <input
                placeholder="Your handle (e.g. @fathiaomar)"
                value={builderHandle}
                onChange={(e) => setBuilderHandle(e.target.value)}
                className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
              />
              <input
                placeholder="Stack (comma separated)"
                value={stack}
                onChange={(e) => setStack(e.target.value)}
                className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
              />
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
              >
                <option value="Looking for Teammates">Looking for Teammates</option>
                <option value="Building">Building</option>
                <option value="Shipped">Shipped</option>
              </select>
            </div>
            <input
              placeholder="GitHub or demo URL (optional)"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
            />
            <textarea
              required
              rows={3}
              placeholder="What are you building and who do you want to ship with?"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
            />
            <div className="flex justify-end gap-2">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-50"
              >
                {submitting ? 'Publishing...' : 'Publish Project'}
              </button>
            </div>
          </form>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <form onSubmit={handleSearchSubmit} className="flex flex-1 gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                placeholder="Search title, stack, or builder..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-900 py-2 pl-9 pr-3 text-sm"
              />
            </div>
            <button
              type="submit"
              className="rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2 text-sm hover:bg-slate-700"
            >
              Search
            </button>
          </form>

          <div className="flex flex-wrap gap-1.5">
            {STATUS_OPTIONS.map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                  statusFilter === st
                    ? 'bg-cyan-500 text-slate-950'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-slate-400">Loading projects...</p>
        ) : projects.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center text-sm text-slate-400">
            No matching projects yet. Click <strong>Post Project</strong> to add the first one.
          </div>
        ) : (
          <div className="grid gap-4">
            {projects.map((proj) => {
              const projectCollabs = collabs.filter((c) => c.projectId === proj.id);
              return (
                <article
                  key={proj.id}
                  className="space-y-3 rounded-xl border border-slate-800 bg-slate-900 p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-semibold text-white">{proj.title}</h3>
                        <span className="rounded-full bg-cyan-500/15 px-2.5 py-0.5 text-xs font-medium text-cyan-300">
                          {proj.status}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-400">
                        By {proj.builderHandle} · {projectCollabs.length} join requests
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleUpvote(proj.id)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs font-semibold hover:border-cyan-500"
                      >
                        <ArrowBigUp className="h-4 w-4 text-cyan-400" />
                        {proj.votes}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(proj.id)}
                        title="Delete project"
                        className="rounded-lg border border-slate-800 p-1.5 text-slate-400 hover:border-red-500/50 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-slate-300">{proj.summary}</p>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <div className="flex flex-wrap gap-1.5">
                      {proj.stack.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-md bg-slate-800 px-2 py-0.5 text-xs text-slate-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-3">
                      {proj.repoUrl && (
                        <a
                          href={proj.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:underline"
                        >
                          Repo <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() =>
                          setActiveJoinProjectId((cur) => (cur === proj.id ? null : proj.id))
                        }
                        className="inline-flex items-center gap-1 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-700"
                      >
                        <Users className="h-3.5 w-3.5 text-cyan-400" />
                        Team Up
                      </button>
                    </div>
                  </div>

                  {activeJoinProjectId === proj.id && (
                    <form
                      onSubmit={(e) => handleJoinSubmit(e, proj.id)}
                      className="mt-3 space-y-2.5 rounded-lg border border-slate-800 bg-slate-950 p-3.5"
                    >
                      <div className="grid gap-2 sm:grid-cols-2">
                        <input
                          required
                          placeholder="Your @handle or name"
                          value={applicantHandle}
                          onChange={(e) => setApplicantHandle(e.target.value)}
                          className="rounded border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs"
                        />
                        <input
                          required
                          placeholder="How can you help?"
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          className="rounded border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs"
                        />
                      </div>
                      <input
                        placeholder="Quick note (optional)"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="w-full rounded border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs"
                      />
                      <button
                        type="submit"
                        className="rounded bg-cyan-500 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:bg-cyan-400"
                      >
                        Send Collab Request
                      </button>
                    </form>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
