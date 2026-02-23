import { ref, watch } from 'vue';

export type AppMode = 'light' | 'dark' | 'auto';

export interface AppSettings {
  mode: AppMode;
}

let isInitialLoad = true;
async function loadSettings(): Promise<AppSettings> {
  try {
    const stored = localStorage.getItem('settings');
    if (stored) {
      const parsed = JSON.parse(stored);
      // Ensure all fields exist by merging with default settings
      return {
        ...settings.value,
        ...parsed,
      };
    }
  } catch (e) {
    console.error('Failed to load settings', e);
  }
  // Fallback to defaults
  return settings.value;
}

export const settings = ref<AppSettings>({
  mode: 'auto',
});
const settingsLoaded = ref(false);

// Initialize settings
loadSettings().then(s => {
  settings.value = s;
  settingsLoaded.value = true;
  // Use nextTick or a small timeout to ensure the watch doesn't trigger on the initial load
  setTimeout(() => {
    isInitialLoad = false;
  }, 0);
});

watch(settings, (newSettings) => {
  if (isInitialLoad) return;
  localStorage.setItem("settings", JSON.stringify(newSettings));
}, { deep: true });

export function useSettings() {
  return {
    settings,
    settingsLoaded,
  };
}
