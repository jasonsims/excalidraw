import { CaptureUpdateAction } from "@excalidraw/element";

import { trackPendoEvent } from "../analytics";

import { register } from "./register";

export const actionToggleArrowBinding = register({
  name: "arrowBinding",
  label: "labels.arrowBinding",
  viewMode: false,
  trackEvent: {
    category: "canvas",
    predicate: (appState) => appState.bindingPreference === "disabled",
  },
  perform(elements, appState, _value, _app, source) {
    const newPreference =
      appState.bindingPreference === "enabled" ? "disabled" : "enabled";
    trackPendoEvent("editor_preference_changed", {
      preference: "arrow_binding",
      newValue: newPreference,
      previousValue: appState.bindingPreference,
      source,
    });
    return {
      appState: {
        ...appState,
        bindingPreference: newPreference,
        isBindingEnabled: newPreference === "enabled",
      },
      captureUpdate: CaptureUpdateAction.NEVER,
    };
  },
  checked: (appState) => appState.bindingPreference === "enabled",
});
