import { motion } from "framer-motion";
import type { GitHubUser } from "../types/github";

interface Props {
  user: GitHubUser;
  total: number;
  currentStreak: number;
  longestStreak: number;
  streakType: "current" | "longest";
  setStreakType: (type: "current" | "longest") => void;
}

export const UserProfile = ({
  user,
  total,
  currentStreak,
  longestStreak,
  streakType,
  setStreakType,
}: Props) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col sm:flex-row items-center gap-8 mt-5 sm:gap-12"
  >
    <img
      src={user.avatar_url}
      alt={user.login}
      className="w-32 h-32 sm:w-36 sm:h-36 rounded-full ring-4 ring-blue-500/30 shadow-xl"
    />
    <div className="text-center sm:text-left">
      <h2 className="text-5xl font-bold text-white dark:text-gray-400">
        {user.name || user.login}
      </h2>
      <p className="text-2xl text-gray-300 dark:text-gray-600 mt-1">
        @{user.login}
      </p>

      <div className="mt-8 flex gap-16 text-lg">
        <div>
          <span className="text-4xl font-bold text-green-400">
            {total.toLocaleString()}
          </span>
          <span className="ml-3 text-gray-400 dark:text-gray-600">
            contributions this year
          </span>
        </div>
        {/* <div className="flex items-center gap-3">
          <span className="text-5xl font-bold text-orange-400">{streak}</span>
          <div>
            <div className="text-2xl font-semibold">day streak 🔥</div>
            <div className="text-sm text-gray-400 dark:text-gray-600">
              Current
            </div>
          </div>
        </div> */}
        <div className="flex items-center gap-6">
          <select
            value={streakType}
            onChange={(e) =>
              setStreakType(e.target.value as "current" | "longest")
            }
            className="px-4 py-2 rounded-lg bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 font-medium"
          >
            <option value="current">Current Streak</option>
            <option value="longest">Longest Streak</option>
          </select>

          <div className="flex items-center gap-3">
            <span className="text-5xl font-bold text-orange-400">
              {streakType === "current" ? currentStreak : longestStreak}
            </span>
            <div>
              {streakType === "current" ? "day streak 🔥" : "longest streak 🔥"}
            </div>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);
