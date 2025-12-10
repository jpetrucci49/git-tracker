import { useState, useEffect } from "react";
import axios, { type AxiosResponse } from "axios";
import type { LanguageData } from "../types/github";

type GitHubRepo = {
  languages_url: string;
  name: string;
  private: boolean;
};

type GitHubReposResponse = AxiosResponse<GitHubRepo[]>;

const COLORS = [
  "#10b981",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
  "#6366f1",
  "#84cc16",
];

export const useUserLanguages = (username: string, enabled: boolean) => {
  const [languages, setLanguages] = useState<LanguageData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!enabled || !username) {
      setLanguages([]);
      return;
    }

    let cancelled = false;
    setLoading(true);

    (async () => {
      try {
        // 1. Get user's repos
        const reposRes = await axios.get<GitHubReposResponse["data"]>(
          `https://api.github.com/users/${username}/repos`,
          {
            params: { per_page: 100 },
            headers: {
              Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`,
            },
          }
        );

        // 2. Fetch languages for each repo (parallel)
        const languagePromises = reposRes.data.map((repo) =>
          axios.get(repo.languages_url, {
            headers: {
              Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`,
            },
          })
        );

        const responses = await Promise.allSettled(languagePromises);
        const languageMap: Record<string, number> = {};

        responses.forEach((result) => {
          if (result.status === "fulfilled") {
            const data = result.value.data;
            Object.entries(data).forEach(([lang, bytes]) => {
              languageMap[lang] = (languageMap[lang] || 0) + (bytes as number);
            });
          }
        });

        const sorted = Object.entries(languageMap)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 10)
          .map(([name, value], i) => ({
            name,
            value,
            color: COLORS[i % COLORS.length],
          }));

        if (!cancelled) setLanguages(sorted);
      } catch (err) {
        console.error("Failed to fetch languages", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [username, enabled]);

  return { languages, loading };
};
