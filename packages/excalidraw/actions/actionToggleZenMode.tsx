import { CODES, KEYS } from "@excalidraw/common";

import { CaptureUpdateAction } from "@excalidraw/element";

import { trackPendoEvent } from "../analytics";
import { coffeeIcon } from "../components/icons";

import { register } from "./register";

export const actionToggleZenMode = register({
  name: "zenMode",
  label: "buttons.zenMode",
  icon: coffeeIcon,
  viewMode: true,
  trackEvent: {
    category: "canvas",
    predicate: (appState) => !appState.zenModeEnabled,
  },
  perform(elements, appState, _value, _app, source) {
    const zenModeEnabled = !this.checked!(appState);
    trackPendoEvent("editor_preference_changed", {
      preference: "zen_mode",
      newValue: zenModeEnabled,
      previousValue: !zenModeEnabled,
      source,
    });
    return {
      appState: {
        ...appState,
        zenModeEnabled,
      },
      captureUpdate: CaptureUpdateAction.EVENTUALLY,
    };
  },
  checked: (appState) => appState.zenModeEnabled,
  predicate: (elements, appState, appProps, app) => {
    return (
      app.editorInterface.formFactor !== "phone" &&
      typeof appProps.zenModeEnabled === "undefined"
    );
  },
  keyTest: (event) =>
    !event[KEYS.CTRL_OR_CMD] && event.altKey && event.code === CODES.Z,
});
