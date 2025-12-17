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
}: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-12 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 dark:from-blue-900 dark:via-purple-900 dark:to-pink-900 rounded-3xl shadow-2xl p-8 md:p-12 overflow-hidden"
    >
      <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
        <img
          src={user.avatar_url}
          alt={user.login}
          className="w-40 h-40 md:w-48 md:h-48 rounded-full ring-8 ring-white/20 shadow-2xl"
        />

        <div className="flex-1 text-center md:text-left">
          <h2 className="text-5xl md:text-6xl font-bold text-white">
            {user.name || user.login}
          </h2>
          <p className="text-2xl md:text-3xl text-white/90 mt-2">
            @{user.login}
          </p>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-8 text-white">
            <div>
              <div className="text-4xl md:text-5xl font-bold">
                {total.toLocaleString()}
              </div>
              <div className="text-lg opacity-90 mt-2">Contributions</div>
              <div className="text-sm opacity-75">This Year</div>
            </div>

            <div>
              <div className="text-4xl md:text-5xl font-bold">
                {streakType === "current" ? currentStreak : longestStreak}
              </div>
              <select
                value={streakType}
                onChange={(e) =>
                  setStreakType(e.target.value as "current" | "longest")
                }
                className="mt-3 px-5 py-2 rounded-xl bg-white/20 text-white border-none focus:outline-none focus:ring-4 focus:ring-white/50 font-medium"
              >
                <option value="current">Current Streak</option>
                <option value="longest">Longest Streak</option>
              </select>
              <div className="text-sm opacity-75 mt-2">
                {streakType === "current"
                  ? "day streak 🔥"
                  : "longest streak 🔥"}
              </div>
            </div>

            <div className="sm:text-right">
              <div className="text-4xl md:text-5xl font-bold">
                {user.public_repos}
              </div>
              <div className="text-lg opacity-90 mt-2">Public Repos</div>
              <div className="text-4xl md:text-5xl font-bold mt-6">
                {user.followers}
              </div>
              <div className="text-lg opacity-90 mt-2">Followers</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
