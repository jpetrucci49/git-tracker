import { motion } from "framer-motion";

export const LoadingSkeleton = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="mt-16 space-y-8"
  >
    <div className="h-32 bg-gray-800 dark:bg-gray-200 rounded-3xl animate-pulse" />
    <div className="h-96 bg-gray-800 dark:bg-gray-200 rounded-3xl animate-pulse" />
  </motion.div>
);
