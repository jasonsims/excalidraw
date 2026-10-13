import { CODES, KEYS } from "@excalidraw/common";

import { CaptureUpdateAction } from "@excalidraw/element";

import { trackPendoEvent } from "../analytics";
import { gridIcon } from "../components/icons";

import { register } from "./register";

export const actionToggleGridMode = register({
  name: "gridMode",
  icon: gridIcon,
  keywords: ["snap"],
  label: "labels.toggleGrid",
  viewMode: true,
  trackEvent: {
    category: "canvas",
    predicate: (appState) => appState.gridModeEnabled,
  },
  perform(elements, appState, _value, _app, source) {
    const gridModeEnabled = !this.checked!(appState);
    trackPendoEvent("editor_preference_changed", {
      preference: "grid",
      newValue: gridModeEnabled,
      previousValue: !gridModeEnabled,
      source,
    });
    return {
      appState: {
        ...appState,
        gridModeEnabled,
        objectsSnapModeEnabled: false,
      },
      captureUpdate: CaptureUpdateAction.EVENTUALLY,
    };
  },
  checked: (appState) => appState.gridModeEnabled,
  predicate: (element, appState, props) => {
    return props.gridModeEnabled === undefined;
  },
  keyTest: (event) => event[KEYS.CTRL_OR_CMD] && event.code === CODES.QUOTE,
});
