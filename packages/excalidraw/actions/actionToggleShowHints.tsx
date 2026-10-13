import { CaptureUpdateAction } from "@excalidraw/element";

import { trackPendoEvent } from "../analytics";
import { messageCircleIcon } from "../components/icons";

import { register } from "./register";

export const actionToggleShowHints = register({
  name: "showHints",
  label: "labels.showHints",
  icon: messageCircleIcon,
  keywords: ["hint", "hints", "tip", "tips"],
  // hints live in the toolbar, which view mode hides entirely
  viewMode: false,
  trackEvent: {
    category: "canvas",
    predicate: (appState) => !appState.showHints,
  },
  perform(elements, appState, _value, _app, source) {
    const showHints = !this.checked!(appState);
    trackPendoEvent("editor_preference_changed", {
      preference: "show_hints",
      newValue: showHints,
      previousValue: !showHints,
      source,
    });
    return {
      appState: {
        ...appState,
        showHints,
      },
      captureUpdate: CaptureUpdateAction.NEVER,
    };
  },
  checked: (appState) => appState.showHints,
});
