import { createEffect, createSignal } from 'solid-js';

export type Theme = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'ui-theme';

function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function getStoredTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    return stored;
  }
  return 'system';
}

function resolveTheme(preference: Theme): 'light' | 'dark' {
  return preference === 'system' ? getSystemTheme() : preference;
}

function applyTheme(resolved: 'light' | 'dark') {
  document.documentElement.setAttribute('data-kb-theme', resolved);
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', resolved === 'dark' ? '#18181b' : '#ffffff');
}

export function initTheme(): Theme {
  const preference = getStoredTheme();
  applyTheme(resolveTheme(preference));
  return preference;
}

const [themePreference, setThemePreference] = createSignal<Theme>(initTheme());
const [resolvedTheme, setResolvedTheme] = createSignal<'light' | 'dark'>(
  resolveTheme(themePreference()),
);

createEffect(() => {
  const preference = themePreference();
  localStorage.setItem(STORAGE_KEY, preference);
  const resolved = resolveTheme(preference);
  setResolvedTheme(resolved);
  applyTheme(resolved);
});

window
  .matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', () => {
    if (themePreference() === 'system') {
      const resolved = getSystemTheme();
      setResolvedTheme(resolved);
      applyTheme(resolved);
    }
  });

export function setTheme(theme: Theme) {
  setThemePreference(theme);
}

export function toggleTheme() {
  setThemePreference((current) => {
    const resolved = resolveTheme(current);
    return resolved === 'dark' ? 'light' : 'dark';
  });
}

export { themePreference, resolvedTheme };
