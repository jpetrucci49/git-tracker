import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import axios from "axios";

import "./App.css";

interface GitHubUser {
  login: string;
  avatar_url: string;
  name?: string;
  public_repos: number;
  followers: number;
}

const App: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("git-tracker-theme");
    return saved ? saved === "dark" : true;
  });

  // Debounced search (waits 500ms after typing stops)
  const debouncedSearch = useCallback((searchTerm: string) => {
    const timer = setTimeout(() => {
      if (searchTerm.trim()) {
        handleSearch(searchTerm);
      } else {
        setUser(null);
        setError(null);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = async (searchTerm: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://api.github.com/users/${searchTerm}`
      );
      setUser(response.data);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        setError("User not found. Try another username.");
      } else {
        setError("Something went wrong. Check your connection.");
      }
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    debouncedSearch(username);
  }, [username, debouncedSearch]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("git-tracker-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("git-tracker-theme", "light");
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "dark" : ""
      }`}
    >
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl font-bold text-gray-900 dark:text-white"
            >
              Git Tracker
            </motion.h1>
            <button
              onClick={toggleDarkMode}
              className="p-3 rounded-xl bg-gray-800 dark:bg-gray-200 text-gray-200 dark:text-gray-800 hover:scale-105 transition"
              aria-label="Toggle theme"
            >
              {darkMode ? "Light" : "Dark"}
            </button>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Enter a GitHub username to see their contribution stats
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g., jpetrucci49 or octocat"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </motion.div>

        {/* Loading Skeleton */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </motion.div>
        )}

        {/* Error State */}
        {error && !isLoading && !user && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8 text-red-600 dark:text-red-400"
          >
            <p className="text-lg font-medium">{error}</p>
          </motion.div>
        )}

        {/* User Card (shows after successful search) */}
        {user && !isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center space-x-4 mb-6">
              <img
                src={user.avatar_url}
                alt={`${user.login}'s avatar`}
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user.name || user.login}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  @{user.login}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user.public_repos} repos • {user.followers} followers
                </p>
              </div>
            </div>
            {/* Placeholder for heatmap (we'll build tomorrow) */}
            <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center text-gray-500 dark:text-gray-400">
              Contribution heatmap coming tomorrow...
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && !error && !user && username.trim() === "" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Start typing a username to get started
            </p>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-4 text-center text-sm text-gray-600 dark:text-gray-300">
          Built by jpetrucci49 • Source on GitHub
        </div>
      </footer>
    </div>
  );
};

export default App;
