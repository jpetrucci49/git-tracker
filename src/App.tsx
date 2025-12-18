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
  const [streakType, setStreakType] = useState<"current" | "longest">(
    "current"
  );

  const {
    user,
    loading: userLoading,
    error: userError,
  } = useGitHubUser(username);
  const {
    days,
    total,
    currentStreak,
    longestStreak,
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
            <UserProfile
              user={user}
              total={total}
              currentStreak={currentStreak}
              longestStreak={longestStreak}
              streakType={streakType}
              setStreakType={setStreakType}
            />
            {user && (
              <div className="mt-8 text-center space-y-4">
                <p className="text-sm text-gray-700 dark:text-gray-500">
                  Date last updated:{" "}
                  {new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <a
                  href={`https://github.com/${user.login}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 rounded-xl font-medium hover:scale-105 transition shadow-lg"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.873.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  View on GitHub
                </a>
              </div>
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
