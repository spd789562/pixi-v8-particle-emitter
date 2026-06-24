import MoonIcon from 'lucide-solid/icons/moon';
import SunIcon from 'lucide-solid/icons/sun';
import { resolvedTheme, toggleTheme } from '@/store/theme';

export function ThemeToggle() {
  return (
    <button
      type="button"
      class="app-icon-btn"
      title={resolvedTheme() === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={toggleTheme}
    >
      {resolvedTheme() === 'dark' ? (
        <SunIcon size={16} />
      ) : (
        <MoonIcon size={16} />
      )}
    </button>
  );
}
