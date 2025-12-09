import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import type { ContributionDay } from "../types/github";

interface Props {
  days: ContributionDay[];
}

export const ContributionHeatmap = ({ days }: Props) => (
  <div className="mt-16 bg-gray-900 dark:bg-white rounded-3xl shadow-2xl p-12 border border-gray-800 dark:border-gray-200">
    <h3 className="text-3xl font-bold text-white dark:text-gray-900 text-center mb-10">
      Contribution Heatmap — Last 12 Months
    </h3>

    <div className="flex gap-2 justify-center overflow-x-auto pb-6">
      {Array.from({ length: 53 }, (_, w) => (
        <div key={w} className="flex flex-col gap-2">
          {Array.from({ length: 7 }, (_, d) => {
            const i = w * 7 + d;
            const day = days[i];
            return day ? (
              <motion.div
                key={day.date}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  delay: i * 0.004,
                  type: "spring",
                  stiffness: 300,
                }}
                className={`w-5 h-5 rounded ${day.color} hover:scale-300 hover:z-10 transition-all shadow-lg`}
                title={`${format(parseISO(day.date), "PPP")} → ${
                  day.contributionCount
                } commits`}
              />
            ) : (
              <div key={i} className="w-5 h-5" />
            );
          })}
        </div>
      ))}
    </div>

    <div className="flex justify-center items-center gap-4 mt-10 text-sm">
      <span className="text-gray-400">Less</span>
      <div className="flex gap-2">
        {[
          "bg-gray-200 dark:bg-gray-800",
          "bg-green-300 dark:bg-green-900",
          "bg-green-500 dark:bg-green-700",
          "bg-green-700 dark:bg-green-500",
          "bg-green-900 dark:bg-green-400",
        ].map((c) => (
          <div key={c} className={`w-6 h-6 rounded ${c}`} />
        ))}
      </div>
      <span className="text-gray-400">More</span>
    </div>
  </div>
);
