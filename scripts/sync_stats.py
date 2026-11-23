import json
import urllib.request
from datetime import datetime, timezone

ORG = "ship-together"
REPO = "studious-fortnight"


def fetch_repo_summary(org: str, repo: str) -> dict:
    url = f"https://api.github.com/repos/{org}/{repo}"
    req = urllib.request.Request(url, headers={"User-Agent": "ship-together-sync"})
    with urllib.request.urlopen(req, timeout=10) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    return {
        "full_name": data.get("full_name"),
        "stars": data.get("stargazers_count", 0),
        "forks": data.get("forks_count", 0),
        "open_issues": data.get("open_issues_count", 0),
        "checked_at": datetime.now(timezone.utc).isoformat(),
    }


if __name__ == "__main__":
    print(json.dumps(fetch_repo_summary(ORG, REPO), indent=2))
