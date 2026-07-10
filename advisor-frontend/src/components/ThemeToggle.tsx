import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className="
        relative w-12 h-12 rounded-lg
        bg-white dark:bg-neutral-900
        border-2 border-neutral-900 dark:border-neutral-100
        flex items-center justify-center
        transition-colors duration-180
        focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#F4C430]
      "
      style={{ boxShadow: '3px 3px 0px #0A0A0A' }}
      whileHover={{ x: -2, y: -2 }}
      whileTap={{ x: 1, y: 1 }}
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'dark' ? 180 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {theme === 'light' ? (
          <Sun size={20} className="text-neutral-900" strokeWidth={1.5} />
        ) : (
          <Moon size={20} className="text-neutral-100" strokeWidth={1.5} />
        )}
      </motion.div>
    </motion.button>
  );
}
