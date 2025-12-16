import { useState, useEffect } from "react";
import axios from "axios";

interface Repo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
}

export const TopRepos = ({ username }: { username: string }) => {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`https://api.github.com/users/${username}/repos`, {
        params: { sort: "stargazers_count", per_page: 6 },
        headers: {
          Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`,
        },
      })
      .then((res) => {
        setRepos(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [username]);

  if (loading)
    return (
      <div className="text-center py-8 text-gray-400">
        Loading repositories...
      </div>
    );
  if (repos.length === 0) return null;

  return (
    <div className="mt-16">
      <h3 className="text-2xl font-bold text-white dark:text-gray-400 text-center mb-8">
        Top Repositories
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {repos.map((repo) => (
          <a
            key={repo.id}
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-800 dark:bg-gray-100 rounded-xl p-6 hover:scale-105 transition shadow-lg border border-gray-700 dark:border-gray-300"
          >
            <h4 className="font-semibold text-white dark:text-gray-900 text-lg">
              {repo.name}
            </h4>
            <p className="text-gray-400 dark:text-gray-600 text-sm mt-2 line-clamp-2">
              {repo.description || "No description"}
            </p>
            <div className="mt-4 flex gap-6 text-sm">
              <span className="text-yellow-400">
                ⭐ {repo.stargazers_count}
              </span>
              <span className="text-blue-400">🍴 {repo.forks_count}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
