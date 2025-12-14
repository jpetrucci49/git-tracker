import { useState, useEffect } from "react";
import axios from "axios";

export const TopRepos = ({ username }: { username: string }) => {
  const [repos, setRepos] = useState<any[]>([]);
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
      });
  }, [username]);

  if (loading) return <div className="text-center py-8">Loading repos...</div>;

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
            className="bg-gray-800 dark:bg-gray-100 rounded-xl p-6 hover:scale-105 transition shadow-lg"
          >
            <h4 className="font-semibold text-white dark:text-gray-900">
              {repo.name}
            </h4>
            <p className="text-gray-400 dark:text-gray-600 text-sm mt-2 line-clamp-2">
              {repo.description || "No description"}
            </p>
            <div className="mt-4 flex gap-4 text-sm text-gray-400 dark:text-gray-600">
              <span>⭐ {repo.stargazers_count}</span>
              <span>🍴 {repo.forks_count}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
