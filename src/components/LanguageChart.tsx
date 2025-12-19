import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import type { LanguageData } from "../types/github";

interface Props {
  data: LanguageData[];
}

export const LanguageChart = ({ data }: Props) => {
  if (data.length === 0) return null;

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-16 bg-gray-900 dark:bg-white rounded-3xl shadow-2xl p-10 border border-gray-800 dark:border-gray-200"
    >
      <h3 className="text-2xl font-bold text-white dark:text-gray-900 text-center mb-8">
        Top Languages
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) =>
              `${name} ${((value / total) * 100).toFixed(1)}%`
            }
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, i) => (
              <Cell key={`cell-${i}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(31, 41, 55, 0.95)",
              border: "1px solid #374151",
              borderRadius: "12px",
              padding: "12px",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
            }}
            labelStyle={{
              color: "#e5e7eb",
              fontWeight: "bold",
              marginBottom: "8px",
            }}
            itemStyle={{
              color: "#f3f4f6",
              padding: "4px 0",
            }}
            cursor={{ fill: "rgba(255, 255, 255, 0.1)" }}
            formatter={(value: number, name: string) => {
              const percentage = ((value / total) * 100).toFixed(1);
              return `${name}: ${value.toLocaleString()} bytes (${percentage}%)`;
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
};
