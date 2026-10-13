import { trackPendoEvent } from "@excalidraw/excalidraw/analytics";
import { useCallback, useRef } from "react";

import type { OrderedExcalidrawElement } from "@excalidraw/element/types";
import type { AppState } from "@excalidraw/excalidraw/types";

import { STORAGE_KEYS } from "./app_constants";

/** approximately when the app started loading */
const appLoadedAt = Date.now();

const isFirstElementCreatedStored = () => {
  try {
    return !!localStorage.getItem(
      STORAGE_KEYS.LOCAL_STORAGE_FIRST_ELEMENT_CREATED,
    );
  } catch {
    return false;
  }
};

/**
 * `first_element_created` is a one-time activation milestone, tracked at most
 * once per browser (persisted in localStorage, shared across tabs).
 */
let isFirstElementCreatedTracked = isFirstElementCreatedStored();

export const markFirstElementCreatedAsTracked = () => {
  if (isFirstElementCreatedTracked) {
    return;
  }
  isFirstElementCreatedTracked = true;
  try {
    localStorage.setItem(
      STORAGE_KEYS.LOCAL_STORAGE_FIRST_ELEMENT_CREATED,
      "true",
    );
  } catch (error: any) {
    // the module-level flag still dedupes for this session
    console.error(error);
  }
};

/**
 * Returns an `onChange` handler which tracks `first_element_created` when the
 * local user puts the first content on an empty canvas (drawing, typing,
 * pasting or inserting). Restored/loaded scenes and remote collab updates
 * aren't counted: those neither create nor select elements locally.
 */
export const useTrackFirstElementCreated = () => {
  // whether the scene had elements on the previous (settled) change.
  // `null` until the first scene is loaded, so restoring it doesn't count.
  const sceneHadElementsRef = useRef<boolean | null>(null);
  // the element being drawn/typed, until it's finalized (a click without
  // a drag discards it)
  const pendingCreationRef = useRef<{ id: string; tool: string } | null>(null);

  return useCallback(
    (
      elements: readonly OrderedExcalidrawElement[],
      appState: AppState,
      context: {
        isCollaborating: boolean;
        formFactor: string;
        langCode: string;
        isExcalidrawPlusSignedUser: boolean;
      },
    ) => {
      if (isFirstElementCreatedTracked) {
        return;
      }

      const creatingElement =
        appState.newElement ?? appState.editingTextElement;
      if (creatingElement) {
        pendingCreationRef.current = {
          id: creatingElement.id,
          tool: appState.activeTool.type,
        };
        return;
      }

      const firstElement = elements.find((element) => !element.isDeleted);
      const sceneHadElements = sceneHadElementsRef.current;
      const pendingCreation = pendingCreationRef.current;
      sceneHadElementsRef.current = !!firstElement;
      pendingCreationRef.current = null;

      if (sceneHadElements !== false || !firstElement) {
        return;
      }

      const createdElement = pendingCreation
        ? elements.find(
            (element) =>
              element.id === pendingCreation.id && !element.isDeleted,
          )
        : undefined;
      if (!createdElement && !appState.selectedElementIds[firstElement.id]) {
        return;
      }

      // may have been tracked in another tab since this one loaded
      if (isFirstElementCreatedStored()) {
        isFirstElementCreatedTracked = true;
        return;
      }
      markFirstElementCreatedAsTracked();

      trackPendoEvent("first_element_created", {
        elementType: (createdElement ?? firstElement).type,
        // only known for elements drawn/typed with a tool
        creationTool: createdElement ? pendingCreation?.tool : undefined,
        timeSinceAppLoadMs: Date.now() - appLoadedAt,
        ...context,
      });
    },
    [],
  );
};
