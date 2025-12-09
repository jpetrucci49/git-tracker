import { motion } from "framer-motion";

interface Props {
  message: string;
}

export const ErrorMessage = ({ message }: Props) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="mt-16 text-center py-16 text-3xl font-medium text-red-400 dark:text-red-500"
  >
    {message}
  </motion.div>
);
