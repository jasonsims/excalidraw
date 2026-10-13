import { THEME } from "@excalidraw/excalidraw";
import { trackPendoEvent } from "@excalidraw/excalidraw/analytics";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import type { Theme } from "@excalidraw/element/types";

import { STORAGE_KEYS } from "./app_constants";

const getDarkThemeMediaQuery = (): MediaQueryList | undefined =>
  window.matchMedia?.("(prefers-color-scheme: dark)");

export const useHandleAppTheme = () => {
  const [appTheme, setAppTheme] = useState<Theme | "system">(() => {
    return (
      (localStorage.getItem(STORAGE_KEYS.LOCAL_STORAGE_THEME) as
        | Theme
        | "system"
        | null) || THEME.LIGHT
    );
  });
  const [editorTheme, setEditorTheme] = useState<Theme>(THEME.LIGHT);
  // every theme change (toggle action, shortcut, main menu) ends up here.
  // Initialized with the restored theme so the initial mount isn't tracked.
  const prevAppThemeRef = useRef(appTheme);

  useEffect(() => {
    const mediaQuery = getDarkThemeMediaQuery();

    const handleChange = (e: MediaQueryListEvent) => {
      setEditorTheme(e.matches ? THEME.DARK : THEME.LIGHT);
    };

    if (appTheme === "system") {
      mediaQuery?.addEventListener("change", handleChange);
    }

    return () => {
      mediaQuery?.removeEventListener("change", handleChange);
    };
  }, [appTheme]);

  useLayoutEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOCAL_STORAGE_THEME, appTheme);

    const nextEditorTheme =
      appTheme === "system"
        ? getDarkThemeMediaQuery()?.matches
          ? THEME.DARK
          : THEME.LIGHT
        : appTheme;
    setEditorTheme(nextEditorTheme);

    if (prevAppThemeRef.current !== appTheme) {
      trackPendoEvent("theme_changed", {
        newTheme: appTheme,
        previousTheme: prevAppThemeRef.current,
        resolvedEditorTheme: nextEditorTheme,
      });
      prevAppThemeRef.current = appTheme;
    }
  }, [appTheme]);

  return { editorTheme, appTheme, setAppTheme };
};
