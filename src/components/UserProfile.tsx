import { motion } from "framer-motion";
import type { GitHubUser } from "../types/github";

interface Props {
  user: GitHubUser;
  total: number;
  streak: number;
}

export const UserProfile = ({ user, total, streak }: Props) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    className="mt-16 bg-gray-900 dark:bg-white rounded-3xl shadow-2xl p-10 flex items-center gap-10 border border-gray-800 dark:border-gray-200"
  >
    <img
      src={user.avatar_url}
      alt={user.login}
      className="w-36 h-36 rounded-full ring-4 ring-blue-500/30 shadow-xl"
    />
    <div>
      <h2 className="text-5xl font-bold text-white dark:text-gray-900">
        {user.name || user.login}
      </h2>
      <p className="text-2xl text-gray-400 dark:text-gray-600 mt-1">
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
        <div>
          <span className="text-4xl font-bold text-yellow-400">{streak}</span>
          <span className="ml-3 text-gray-400 dark:text-gray-600">
            day streak
          </span>
        </div>
      </div>
    </div>
  </motion.div>
);
