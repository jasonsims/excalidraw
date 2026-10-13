import { LIBRARY_DISABLED_TYPES, randomId } from "@excalidraw/common";
import { deepCopyElement } from "@excalidraw/element";

import { CaptureUpdateAction } from "@excalidraw/element";

import { getElementTypes, trackPendoEvent } from "../analytics";
import { t } from "../i18n";

import { register } from "./register";

export const actionAddToLibrary = register({
  name: "addToLibrary",
  trackEvent: { category: "element" },
  perform: (elements, appState, _, app, source) => {
    const selectedElements = app.scene.getSelectedElements({
      selectedElementIds: appState.selectedElementIds,
      includeBoundTextElement: true,
      includeElementsInFrames: true,
    });

    const trackLibraryItemAdded = (details: {
      totalLibraryItems?: number;
      success: boolean;
      rejectedElementType?: string;
    }) => {
      trackPendoEvent("library_item_added", {
        elementCount: selectedElements.length,
        elementTypes: getElementTypes(selectedElements),
        source,
        ...details,
      });
    };

    for (const type of LIBRARY_DISABLED_TYPES) {
      if (selectedElements.some((element) => element.type === type)) {
        trackLibraryItemAdded({ success: false, rejectedElementType: type });
        return {
          captureUpdate: CaptureUpdateAction.EVENTUALLY,
          appState: {
            ...appState,
            errorMessage: t(`errors.libraryElementTypeError.${type}`),
          },
        };
      }
    }

    return app.library
      .getLatestLibrary()
      .then((items) => {
        return app.library.setLibrary([
          {
            id: randomId(),
            status: "unpublished",
            elements: selectedElements.map(deepCopyElement),
            created: Date.now(),
          },
          ...items,
        ]);
      })
      .then((items) => {
        trackLibraryItemAdded({
          totalLibraryItems: items.length,
          success: true,
        });
        return {
          captureUpdate: CaptureUpdateAction.EVENTUALLY,
          appState: {
            ...appState,
            toast: { message: t("toast.addedToLibrary") },
          },
        };
      })
      .catch((error) => {
        trackLibraryItemAdded({ success: false });
        return {
          captureUpdate: CaptureUpdateAction.EVENTUALLY,
          appState: {
            ...appState,
            errorMessage: error.message,
          },
        };
      });
  },
  label: "labels.addToLibrary",
});
