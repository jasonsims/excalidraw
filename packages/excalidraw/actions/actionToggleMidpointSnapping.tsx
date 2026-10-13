import { CaptureUpdateAction } from "@excalidraw/element";

import { trackPendoEvent } from "../analytics";

import { register } from "./register";

export const actionToggleMidpointSnapping = register({
  name: "midpointSnapping",
  label: "labels.midpointSnapping",
  viewMode: false,
  trackEvent: {
    category: "canvas",
    predicate: (appState) => !appState.isMidpointSnappingEnabled,
  },
  perform(elements, appState, _value, _app, source) {
    const isMidpointSnappingEnabled = !this.checked!(appState);
    trackPendoEvent("editor_preference_changed", {
      preference: "midpoint_snapping",
      newValue: isMidpointSnappingEnabled,
      previousValue: !isMidpointSnappingEnabled,
      source,
    });
    return {
      appState: {
        ...appState,
        isMidpointSnappingEnabled,
      },
      captureUpdate: CaptureUpdateAction.NEVER,
    };
  },
  checked: (appState) => appState.isMidpointSnappingEnabled,
});
