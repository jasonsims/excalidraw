import { CODES, KEYS } from "@excalidraw/common";

import { CaptureUpdateAction } from "@excalidraw/element";

import { trackPendoEvent } from "../analytics";
import { eyeIcon } from "../components/icons";

import { register } from "./register";

export const actionToggleViewMode = register({
  name: "viewMode",
  label: "labels.viewMode",
  icon: eyeIcon,
  viewMode: true,
  trackEvent: {
    category: "canvas",
    predicate: (appState) => !appState.viewModeEnabled,
  },
  perform(elements, appState, _value, _app, source) {
    const viewModeEnabled = !this.checked!(appState);
    trackPendoEvent("editor_preference_changed", {
      preference: "view_mode",
      newValue: viewModeEnabled,
      previousValue: !viewModeEnabled,
      source,
    });
    return {
      appState: {
        ...appState,
        viewModeEnabled,
      },
      captureUpdate: CaptureUpdateAction.EVENTUALLY,
    };
  },
  checked: (appState) => appState.viewModeEnabled,
  predicate: (elements, appState, appProps, app) => {
    return (
      typeof appProps.viewModeEnabled === "undefined" &&
      app.isInteractionEnabled()
    );
  },
  keyTest: (event) =>
    !event[KEYS.CTRL_OR_CMD] && event.altKey && event.code === CODES.R,
});
