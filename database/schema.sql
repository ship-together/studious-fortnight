CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS builder_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL CHECK (char_length(trim(title)) >= 3),
    summary TEXT NOT NULL,
    stack TEXT[] NOT NULL DEFAULT '{}',
    builder_handle TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Building', 'Shipped', 'Looking for Teammates')),
    repo_url TEXT,
    votes INTEGER NOT NULL DEFAULT 1 CHECK (votes >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS collab_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES builder_projects(id) ON DELETE CASCADE,
    applicant_handle TEXT NOT NULL,
    role TEXT NOT NULL,
    note TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_builder_projects_status ON builder_projects(status);
CREATE INDEX IF NOT EXISTS idx_builder_projects_votes ON builder_projects(votes DESC);
CREATE INDEX IF NOT EXISTS idx_collab_requests_project_id ON collab_requests(project_id);
