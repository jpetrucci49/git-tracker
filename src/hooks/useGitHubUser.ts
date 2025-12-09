import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";

import type { GitHubUser } from "../types/github";

export const useGitHubUser = (username: string) => {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username.trim()) {
      setUser(null);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    const timer = setTimeout(async () => {
      try {
        const res = await axios.get(
          `https://api.github.com/users/${username}`,
          {
            headers: {
              Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`,
            },
          }
        );
        if (!cancelled) {
          setUser(res.data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setUser(null);
          if (err instanceof AxiosError) {
            setError(
              err.response?.status === 404 ? "User not found" : "Network error"
            );
          } else if (err instanceof Error) {
            setError(err.message);
          } else {
            throw new Error("Unknown Error Encountered");
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 600);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [username]);

  return { user, loading, error };
};
