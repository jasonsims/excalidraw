import { CODES, KEYS } from "@excalidraw/common";

import { CaptureUpdateAction } from "@excalidraw/element";

import { trackPendoEvent } from "../analytics";
import { magnetIcon } from "../components/icons";

import { register } from "./register";

export const actionToggleObjectsSnapMode = register({
  name: "objectsSnapMode",
  label: "buttons.objectsSnapMode",
  icon: magnetIcon,
  viewMode: false,
  trackEvent: {
    category: "canvas",
    predicate: (appState) => !appState.objectsSnapModeEnabled,
  },
  perform(elements, appState, _value, _app, source) {
    const objectsSnapModeEnabled = !this.checked!(appState);
    trackPendoEvent("editor_preference_changed", {
      preference: "snap_to_objects",
      newValue: objectsSnapModeEnabled,
      previousValue: !objectsSnapModeEnabled,
      source,
    });
    return {
      appState: {
        ...appState,
        objectsSnapModeEnabled,
        gridModeEnabled: false,
      },
      captureUpdate: CaptureUpdateAction.EVENTUALLY,
    };
  },
  checked: (appState) => appState.objectsSnapModeEnabled,
  predicate: (elements, appState, appProps) => {
    return typeof appProps.objectsSnapModeEnabled === "undefined";
  },
  keyTest: (event) =>
    !event[KEYS.CTRL_OR_CMD] && event.altKey && event.code === CODES.S,
});
