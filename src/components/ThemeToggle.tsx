interface Props {
  darkMode: boolean;
  toggle: () => void;
}

export const ThemeToggle = ({ darkMode, toggle }: Props) => (
  <button
    onClick={toggle}
    className="px-6 py-3 rounded-xl font-medium bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 hover:scale-105 transition"
  >
    {darkMode ? "Light Mode" : "Dark Mode"}
  </button>
);
