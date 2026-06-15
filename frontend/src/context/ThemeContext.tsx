import React, { createContext, useContext, useState, useEffect } from 'react';

export type AppTheme = 'slate' | 'dark';
export type FontSize = 'small' | 'medium' | 'large' | 'xl';
export type LineHeight = 'tight' | 'normal' | 'loose';

interface ThemeContextType {
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  lineHeight: LineHeight;
  setLineHeight: (height: LineHeight) => void;
  editorFontSize: number;
  setEditorFontSize: (size: number) => void;
  editorFontFamily: string;
  setEditorFontFamily: (family: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<AppTheme>(() => {
    const saved = localStorage.getItem('nlc_theme') as AppTheme;
    return (saved === 'slate' || saved === 'dark') ? saved : 'slate';
  });
  const [fontSize, setFontSizeState] = useState<FontSize>(() => {
    return (localStorage.getItem('nlc_font_size') as FontSize) || 'medium';
  });
  const [lineHeight, setLineHeightState] = useState<LineHeight>(() => {
    return (localStorage.getItem('nlc_line_height') as LineHeight) || 'normal';
  });
  const [editorFontSize, setEditorFontSizeState] = useState<number>(() => {
    const saved = localStorage.getItem('nlc_editor_font_size');
    return saved ? parseInt(saved, 10) : 14;
  });
  const [editorFontFamily, setEditorFontFamilyState] = useState<string>(() => {
    return localStorage.getItem('nlc_editor_font_family') || "'Fira Code', 'JetBrains Mono', monospace";
  });

  const setTheme = (t: AppTheme) => {
    setThemeState(t);
    localStorage.setItem('nlc_theme', t);
  };

  const setFontSize = (s: FontSize) => {
    setFontSizeState(s);
    localStorage.setItem('nlc_font_size', s);
  };

  const setLineHeight = (h: LineHeight) => {
    setLineHeightState(h);
    localStorage.setItem('nlc_line_height', h);
  };

  const setEditorFontSize = (size: number) => {
    setEditorFontSizeState(size);
    localStorage.setItem('nlc_editor_font_size', size.toString());
  };

  const setEditorFontFamily = (family: string) => {
    setEditorFontFamilyState(family);
    localStorage.setItem('nlc_editor_font_family', family);
  };

  useEffect(() => {
    // 1. Apply theme class to documentElement
    const root = document.documentElement;
    root.classList.forEach((cls) => {
      if (cls.startsWith('theme-')) {
        root.classList.remove(cls);
      }
    });
    root.classList.add(`theme-${theme}`);

    // 2. Apply font scale variables
    const fontScaleMap = {
      small: '0.875',
      medium: '1.0',
      large: '1.125',
      xl: '1.25',
    };
    root.style.setProperty('--font-scale', fontScaleMap[fontSize]);

    // 3. Apply line height scale variables
    const lineHeightMap = {
      tight: '1.35',
      normal: '1.5',
      loose: '1.75',
    };
    root.style.setProperty('--line-height-scale', lineHeightMap[lineHeight]);

    // 4. Apply editor styling variables
    root.style.setProperty('--editor-font-size', `${editorFontSize}px`);
    root.style.setProperty('--editor-font-family', editorFontFamily);
  }, [theme, fontSize, lineHeight, editorFontSize, editorFontFamily]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        fontSize,
        setFontSize,
        lineHeight,
        setLineHeight,
        editorFontSize,
        setEditorFontSize,
        editorFontFamily,
        setEditorFontFamily,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useAppTheme must be used within a ThemeProvider');
  }
  return context;
};
