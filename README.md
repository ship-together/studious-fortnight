
<div align="center">

# ⚡ studious-fortnight

**Ship Together Builder Hub, Project Showcase & Collaboration Workspace**

[![Org](https://img.shields.io/badge/Org-ship--together-00C2FF?style=for-the-badge&logo=github)](https://github.com/ship-together)
[![License](https://img.shields.io/badge/License-Apache--2.0-08f7fe?style=for-the-badge)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.24-363636?style=for-the-badge&logo=solidity)](contracts/BuilderRegistry.sol)
[![Python](https://img.shields.io/badge/Python-3.x-3776AB?style=for-the-badge&logo=python&logoColor=white)](scripts/sync_stats.py)

*Post what you're building, find sprint teammates, upvote shipped releases, and log builder milestones on-chain.*

[Explore Organization](https://github.com/ship-together) · [Report Bug](https://github.com/ship-together/studious-fortnight/issues) · [Request Feature](https://github.com/ship-together/studious-fortnight/issues)

</div>

---

## ✨ Key Features

- **🚀 Live Builder Project Board:** Publish active builds, shipped apps, and open teammate requests with stack tags and repo links.
- **🤝 One-Click Team-Up Requests:** Builders can apply directly to projects with their GitHub handle, target role, and collaboration note.
- **⬆️ Community Upvoting & Filtering:** Filter builds by status (`Looking for Teammates`, `Building`, `Shipped`) or search across titles, stacks, and handles.
- **⛓️ On-Chain Builder Registry:** Includes `BuilderRegistry.sol` to register builder handles and record shipped project milestones on EVM networks.
- **📊 Automated Repo Telemetry:** Includes a zero-dependency Python utility (`sync_stats.py`) to fetch live star, fork, and issue metrics from the GitHub API.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons |
| **Backend API** | Node.js, Express, CORS, TSX |
| **Smart Contracts** | Solidity (`^0.8.24`) |
| **Automation** | Python 3 (`urllib`, `json`) |

---

## 📂 Repository Structure

```text
studious-fortnight/
├── contracts/
│   └── BuilderRegistry.sol    # On-chain builder handle & shipped-count registry
├── scripts/
│   └── sync_stats.py          # GitHub REST API repository metrics fetcher
├── server/
│   ├── index.ts               # Express server entrypoint & middleware
│   ├── routes.ts              # REST API routes for projects & collaboration requests
│   └── store.ts               # In-memory store with seeded Ship Together projects
├── src/
│   ├── App.tsx                # Main interactive builder hub & collaboration UI
│   ├── api.ts                 # Typed frontend API client
│   ├── index.css              # Tailwind v4 & dark-mode base styles
│   ├── main.tsx               # React DOM mount entrypoint
│   └── types.ts               # Shared TypeScript interfaces
├── .env.example               # Environment configuration template
├── .gitattributes             # Linguist language detection rules
├── .gitignore                 # Node & environment ignore rules
├── index.html                 # HTML entry shell
├── LICENSE                    # Apache-2.0 License
├── package.json               # Scripts & dependencies
└── vite.config.ts             # Vite dev server & /api proxy config
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/ship-together/studious-fortnight.git
cd studious-fortnight
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

```bash
cp .env.example .env
```

Default `.env` values:

```ini
PORT=4000
VITE_API_URL=http://localhost:4000
ORG_NAME=ship-together
REPO_NAME=studious-fortnight
```

### 4. Run Full-Stack Development Mode

```bash
npm run dev
```

- **Frontend UI:** `http://localhost:5173`
- **Backend API:** `http://localhost:4000/api`

---

## 🔌 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Check API health and repository metadata |
| `GET` | `/api/projects` | List projects (supports `?q=` search & `?status=` filter) |
| `POST` | `/api/projects` | Publish a new builder project |
| `POST` | `/api/projects/:id/upvote` | Increment upvote count for a project |
| `DELETE` | `/api/projects/:id` | Delete a project by ID |
| `GET` | `/api/collabs` | List collaboration requests (optional `?projectId=`) |
| `POST` | `/api/collabs` | Submit a collaboration / team-up request |

---

## 🐍 Running Repo Telemetry Script

Fetch live repository stats directly via Python:

```bash
python scripts/sync_stats.py
```

---

## 🤝 Contributing

1. Fork the repository or join [`ship-together`](https://github.com/ship-together).
2. Create your feature branch (`git checkout -b feat/amazing-feature`).
3. Commit your changes (`git commit -m "feat: add amazing feature"`).
4. Push to the branch (`git push origin feat/amazing-feature`).
5. Open a **Pull Request**.

---

## 📄 License

Distributed under the **Apache-2.0 License**. See [`LICENSE`](LICENSE) for full details.
