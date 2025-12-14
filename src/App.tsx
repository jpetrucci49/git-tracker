import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ThemeToggle } from "./components/ThemeToggle";
import { SearchInput } from "./components/SearchInput";
import { TopRepos } from "./components/TopRepos";
import { UserProfile } from "./components/UserProfile";
import { ContributionHeatmap } from "./components/ContributionHeatmap";
import { LanguageChart } from "./components/LanguageChart";
import { LoadingSkeleton } from "./components/LoadingSkeleton";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { ErrorMessage } from "./components/ErrorMessage";
import { useGitHubUser } from "./hooks/useGitHubUser";
import { useContributions } from "./hooks/useContributions";
import { useUserLanguages } from "./hooks/useUserLanguages";

function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlUser = searchParams.get("user") || "";

  const [username, setUsername] = useState(urlUser);
  const [darkMode, setDarkMode] = useState(true);

  const {
    user,
    loading: userLoading,
    error: userError,
  } = useGitHubUser(username);
  const {
    days,
    total,
    streak,
    loading: contribLoading,
  } = useContributions(username, !!user);
  const { languages, loading: langLoading } = useUserLanguages(
    username,
    !!user
  );

  // Sync URL when username changes
  useEffect(() => {
    if (username) {
      setSearchParams({ user: username });
    } else {
      setSearchParams({});
    }
  }, [username, setSearchParams]);

  // Load from URL on mount
  useEffect(() => {
    if (urlUser && !username) {
      setUsername(urlUser);
    }
  }, [urlUser, username]);

  // Dark mode persistence
  useEffect(() => {
    const saved = localStorage.getItem("git-tracker-theme");
    setDarkMode(saved !== "light");
  }, []);

  // Dark mode toggle
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("git-tracker-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const isLoading = userLoading || contribLoading || langLoading;

  const shareUrl = username ? `${window.location.origin}?user=${username}` : "";

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-gray-900 dark:bg-white shadow-lg border-b border-gray-800 dark:border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-8 flex justify-between items-center">
          <h1 className="text-4xl font-bold text-white dark:text-gray-900">
            Git Tracker
          </h1>
          <ThemeToggle
            darkMode={darkMode}
            toggle={() => setDarkMode(!darkMode)}
          />
        </div>
        <p className="text-center text-gray-400 dark:text-gray-600 pb-4">
          Enter a GitHub username to see their contribution stats
        </p>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <SearchInput value={username} onChange={setUsername} />

        {isLoading && <LoadingSkeleton />}
        {userError && <ErrorMessage message={userError} />}
        {user && days.length > 0 && (
          <>
            <UserProfile user={user} total={total} streak={streak} />
            {user && (
              <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-8">
                Data last updated: {new Date().toLocaleString()}
              </p>
            )}
            <ContributionHeatmap days={days} />

            {langLoading ? (
              <LoadingSpinner />
            ) : languages.length > 0 ? (
              <LanguageChart data={languages} />
            ) : null}

            {user && <TopRepos username={user.login} />}

            {/* Share Button */}
            {username && (
              <div className="mt-12 text-center">
                <button
                  onClick={() => navigator.clipboard.writeText(shareUrl)}
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-lg hover:scale-105 transition"
                >
                  Copy Share Link
                </button>
                <p className="text-gray-400 mt-3 text-sm">
                  Share this user's stats instantly
                </p>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 py-8 border-t border-gray-800 dark:border-gray-300">
        <p className="text-center text-gray-500 dark:text-gray-400">
          Built by{" "}
          <span className="font-semibold text-white dark:text-gray-500">
            jpetrucci49
          </span>{" "}
          •{" "}
          <a
            href="https://github.com/jpetrucci49/git-tracker"
            target="_blank"
            className="underline"
          >
            Source on GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
