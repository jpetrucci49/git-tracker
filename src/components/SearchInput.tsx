import { motion } from "framer-motion";

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export const SearchInput = ({
  value,
  onChange,
  placeholder = "Enter GitHub username...",
}: Props) => (
  <motion.input
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    type="text"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className="w-full px-8 py-5 text-xl rounded-2xl border-2 border-gray-700 dark:border-gray-300 bg-gray-900 dark:bg-white text-white dark:text-gray-900 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/50 shadow-xl"
  />
);
