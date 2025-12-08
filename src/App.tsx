import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { request, gql } from "graphql-request";
import { format, parseISO, differenceInDays, startOfDay } from "date-fns";

import "./App.css";

interface GitHubUser {
  login: string;
  avatar_url: string;
  name?: string;
  public_repos: number;
  followers: number;
}

interface ContributionDay {
  date: string;
  contributionCount: number;
  color: string;
}
const GITHUB_GRAPHQL = "https://api.github.com/graphql";

const CONTRIBUTION_QUERY = gql`
  query ($username: String!) {
    user(login: $username) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              weekday
            }
          }
        }
      }
    }
  }
`;

const App: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("git-tracker-theme");
    return saved ? saved === "dark" : true;
  });
  const [contributions, setContributions] = useState<ContributionDay[]>([]);
  const [totalContributions, setTotalContributions] = useState<number>(0);
  const [currentStreak, setCurrentStreak] = useState<number>(0);

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

  const fetchContributions = async (login: string) => {
    try {
      const data: any = await request(
        GITHUB_GRAPHQL,
        CONTRIBUTION_QUERY,
        {
          username: login,
        },
        {
          Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`,
        }
      );
      const weeks =
        data.user.contributionsCollection.contributionCalendar.weeks;
      const total =
        data.user.contributionsCollection.contributionCalendar
          .totalContributions;

      const days: ContributionDay[] = [];
      weeks.forEach((week: any) => {
        week.contributionDays.forEach((day: any) => {
          const count = day.contributionCount;
          days.push({
            date: day.date,
            contributionCount: count,
            color:
              count === 0
                ? "bg-gray-200 dark:bg-gray-800"
                : count < 5
                ? "bg-green-300 dark:bg-green-900"
                : count < 10
                ? "bg-green-500 dark:bg-green-700"
                : count < 20
                ? "bg-green-700 dark:bg-green-500"
                : "bg-green-900 dark:bg-green-400",
          });
        });
      });

      setContributions(days);
      setTotalContributions(total);
      calculateCurrentStreak(days);
    } catch (err) {
      console.error(err);
      setError(
        "Could not fetch contributions (rate-limited or private profile)"
      );
    }
  };

  const calculateCurrentStreak = (days: ContributionDay[]) => {
    let streak = 0;
    const today = startOfDay(new Date());
    let currentDate = today;

    for (let i = days.length - 1; i >= 0; i--) {
      const dayDate = startOfDay(parseISO(days[i].date));
      if (differenceInDays(currentDate, dayDate) > 1) break;
      if (
        differenceInDays(currentDate, dayDate) === 0 &&
        days[i].contributionCount > 0
      ) {
        streak++;
        currentDate = dayDate;
        currentDate.setDate(currentDate.getDate() - 1);
      }
    }
    setCurrentStreak(streak);
  };

  const handleSearch = async (searchTerm: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://api.github.com/users/${searchTerm}`,
        {
          headers: {
            Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`,
          },
        }
      );
      setUser(response.data);
      await fetchContributions(searchTerm);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        setError("User not found. Try another username.");
      } else {
        setError("Something went wrong. Check your connection.");
      }
      setUser(null);
      setContributions([]);
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
    <div className={"min-h-screen transition-colors duration-300"}>
      {/* Header */}
      <header className="bg-gray-900 dark:bg-white shadow-lg border-b border-gray-800 dark:border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-6 flex items-center justify-between">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-bold text-white dark:text-gray-900"
          >
            Git Tracker
          </motion.h1>
          <button
            onClick={toggleDarkMode}
            className="px-6 py-3 rounded-xl font-medium bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 hover:scale-105 transition"
            aria-label="Toggle theme"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
        <p className="text-center text-gray-400 dark:text-gray-600 pb-4">
          Enter a GitHub username to see their contribution stats
        </p>
      </header>
      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-10">
        {/* Search Bar */}
        <motion.input
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter GitHub username..."
          className="w-full px-8 py-5 text-xl rounded-2xl rounded-2xl border-2 border-gray-700 dark:border-gray-300 bg-gray-900 dark:bg-white text-white dark:text-gray-900 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/50 shadow-xl"
        />
        {/* Loading Skeleton */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="mt-12 text-center text-2xl text-gray-400" />
            <div className="mt-12 text-center text-2xl text-gray-400" />
          </motion.div>
        )}
        {/* Error State */}
        {error && !isLoading && !user && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-12 text-center text-2xl text-red-400 dark:text-red-500"
          >
            <p className="text-lg font-medium">{error}</p>
          </motion.div>
        )}

        {/* User Card (shows after successful search) */}
        {user && contributions.length > 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="mt-12 space-y-10"
          >
            <div className="bg-gray-900 dark:bg-white rounded-3xl shadow-2xl p-10 flex items-center gap-8 border border-gray-800 dark:border-gray-200">
              <img
                src={user.avatar_url}
                alt={`${user.login}'s avatar`}
                className="w-24 h-24 rounded-full ring-4 ring-blue-500/30"
              />
              <div>
                <h2 className="text-4xl font-bold text-white dark:text-gray-900">
                  {user.name || user.login}
                </h2>
                <p className="text-xl text-gray-400 dark:text-gray-600">
                  @{user.login}
                </p>
                <div className="mt-6 flex gap-12 text-lg">
                  <span className="text-gray-400 dark:text-gray-600 ml-2">
                    <strong>{totalContributions}</strong> contributions this
                    year
                  </span>
                  <span>
                    <span className="text-3xl font-bold text-yellow-400">
                      {currentStreak}
                    </span>{" "}
                    <span className="text-gray-400 dark:text-gray-600 ml-2">
                      day streak
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Heatmap */}
            <div className="bg-gray-900 dark:bg-white rounded-3xl shadow-2xl p-10 border border-gray-800 dark:border-gray-200">
              <h3 className="text-2xl font-bold text-white dark:text-gray-900 mb-8 text-center">
                Contribution Heatmap (Last Year)
              </h3>
              <div className="flex gap-2 justify-center overflow-x-auto pb-4">
                {Array.from({ length: 53 }, (_, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-2">
                    {Array.from({ length: 7 }, (_, dayIndex) => {
                      const index = weekIndex * 7 + dayIndex;
                      const day = contributions[index];
                      return day ? (
                        <motion.div
                          key={day.date}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.003 }}
                          className={`w-4 h-4 rounded ${day.color} hover:scale-300 hover:z-10 transition-all shadow-md`}
                          title={`${format(parseISO(day.date), "PPP")} – ${
                            day.contributionCount
                          } contributions`}
                        />
                      ) : (
                        <div key={index} className="w-4 h-4" />
                      );
                    })}
                  </div>
                ))}
              </div>
              <div className="flex justify-center items-center gap-4 mt-8 text-sm">
                <span className="text-gray-400">Less</span>
                {[
                  "bg-gray-200 dark:bg-gray-800",
                  "bg-green-300 dark:bg-green-900",
                  "bg-green-500 dark:bg-green-700",
                  "bg-green-700 dark:bg-green-500",
                  "bg-green-900 dark:bg-green-400",
                ].map((c) => (
                  <div key={c} className={`w-5 h-5 rounded ${c}`} />
                ))}
                <span className="text-gray-400">More</span>
              </div>
            </div>
          </motion.div>
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
};

export default App;
