
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AppConfig {
  // Theme configuration
  theme: 'light' | 'dark' | 'system';
  reducedMotion: boolean;
  highContrastMode: boolean;
  
  // Notification preferences
  emailNotifications: boolean;
  pushNotifications: boolean;
  
  // UI preferences
  sidebarExpanded: boolean;
  defaultDateFormat: string;
  defaultCurrency: string;
  
  // Performance settings
  enableAnimations: boolean;
  prefetchData: boolean;
}

interface ConfigState extends AppConfig {
  updateConfig: (config: Partial<AppConfig>) => void;
  resetConfig: () => void;
}

const defaultConfig: AppConfig = {
  theme: 'system',
  reducedMotion: false,
  highContrastMode: false,
  emailNotifications: true,
  pushNotifications: true,
  sidebarExpanded: true,
  defaultDateFormat: 'MM/DD/YYYY',
  defaultCurrency: 'USD',
  enableAnimations: true,
  prefetchData: true,
};

export const useConfigStore = create<ConfigState>()(
  persist(
    (set) => ({
      ...defaultConfig,
      
      updateConfig: (newConfig) => 
        set((state) => ({
          ...state,
          ...newConfig,
        })),
        
      resetConfig: () => 
        set(defaultConfig),
    }),
    {
      name: 'app-config',
      // Only persist specific fields
      partialize: (state) => ({
        theme: state.theme,
        reducedMotion: state.reducedMotion,
        highContrastMode: state.highContrastMode,
        emailNotifications: state.emailNotifications,
        pushNotifications: state.pushNotifications,
        sidebarExpanded: state.sidebarExpanded,
        defaultDateFormat: state.defaultDateFormat,
        defaultCurrency: state.defaultCurrency,
        enableAnimations: state.enableAnimations,
        prefetchData: state.prefetchData,
      }),
    }
  )
);

// Utility hooks for common config operations
export const useThemeConfig = () => {
  const { theme, updateConfig } = useConfigStore();
  return {
    theme,
    setTheme: (newTheme: AppConfig['theme']) => updateConfig({ theme: newTheme }),
  };
};

export const useNotificationConfig = () => {
  const { emailNotifications, pushNotifications, updateConfig } = useConfigStore();
  return {
    emailNotifications,
    pushNotifications,
    setEmailNotifications: (enabled: boolean) => 
      updateConfig({ emailNotifications: enabled }),
    setPushNotifications: (enabled: boolean) => 
      updateConfig({ pushNotifications: enabled }),
  };
};

export const useUIConfig = () => {
  const { 
    sidebarExpanded, 
    enableAnimations, 
    highContrastMode,
    reducedMotion,
    updateConfig 
  } = useConfigStore();
  
  return {
    sidebarExpanded,
    enableAnimations,
    highContrastMode,
    reducedMotion,
    setSidebarExpanded: (expanded: boolean) => 
      updateConfig({ sidebarExpanded: expanded }),
    setEnableAnimations: (enabled: boolean) => 
      updateConfig({ enableAnimations: enabled }),
    setHighContrastMode: (enabled: boolean) => 
      updateConfig({ highContrastMode: enabled }),
    setReducedMotion: (enabled: boolean) => 
      updateConfig({ reducedMotion: enabled }),
  };
};

