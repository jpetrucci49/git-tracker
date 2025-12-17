import { motion } from "framer-motion";

interface Props {
  total: number;
  currentStreak: number;
  longestStreak: number;
  streakType: "current" | "longest";
  setStreakType: (type: "current" | "longest") => void;
  repos: number;
  followers: number;
}

export const StatsCard = ({
  total,
  currentStreak,
  longestStreak,
  streakType,
  setStreakType,
  repos,
  followers,
}: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-12 bg-gradient-to-br from-blue-600 to-purple-700 dark:from-blue-900 dark:to-purple-900 rounded-3xl shadow-2xl p-8 text-white overflow-hidden"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div>
          <div className="text-5xl font-bold">{total.toLocaleString()}</div>
          <div className="text-lg opacity-90 mt-2">Contributions</div>
          <div className="text-sm opacity-75">This Year</div>
        </div>

        <div>
          <div className="text-5xl font-bold">
            {streakType === "current" ? currentStreak : longestStreak}
          </div>
          <select
            value={streakType}
            onChange={(e) =>
              setStreakType(e.target.value as "current" | "longest")
            }
            className="mt-2 px-4 py-2 rounded-lg bg-white/20 text-white border-none focus:outline-none focus:ring-2 focus:ring-white/50 text-sm font-medium"
          >
            <option value="current">Current Streak</option>
            <option value="longest">Longest Streak</option>
          </select>
          <div className="text-sm opacity-75 mt-1">days 🔥</div>
        </div>

        <div>
          <div className="text-5xl font-bold">{repos}</div>
          <div className="text-lg opacity-90 mt-2">Public Repos</div>
        </div>

        <div>
          <div className="text-5xl font-bold">{followers}</div>
          <div className="text-lg opacity-90 mt-2">Followers</div>
        </div>
      </div>
    </motion.div>
  );
};
