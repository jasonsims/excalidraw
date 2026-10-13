// place here categories that you want to track. We want to track just a

import { isDevEnv } from "@excalidraw/common";

// small subset of categories at a given time.
const ALLOWED_CATEGORIES_TO_TRACK = new Set([
  "command_palette",
  "export",
  "ai",
]);

export const trackEvent = (
  category: string,
  action: string,
  label?: string,
  value?: number,
) => {
  try {
    if (
      typeof window === "undefined" ||
      import.meta.env.VITE_WORKER_ID ||
      import.meta.env.VITE_APP_ENABLE_TRACKING !== "true"
    ) {
      return;
    }

    if (!ALLOWED_CATEGORIES_TO_TRACK.has(category)) {
      return;
    }

    if (isDevEnv()) {
      // comment out to debug in dev
      return;
    }

    if (!import.meta.env.PROD) {
      console.info("trackEvent", { category, action, label, value });
    }

    if (window.sa_event) {
      window.sa_event(action, {
        category,
        label,
        value,
      });
    }
  } catch (error) {
    console.error("error during analytics", error);
  }
};

/**
 * Reports a conversational AI agent interaction to Pendo. No-op unless the
 * host page has loaded the Pendo agent.
 */
export const trackAgent = (
  ownerWindow: Window,
  eventType: "prompt" | "agent_response" | "user_reaction",
  metadata: {
    agentId: string;
    conversationId: string;
    messageId: string;
    /** message text, or the reaction type for `user_reaction` events */
    content: string;
    modelUsed?: string;
    suggestedPrompt?: boolean;
    toolsUsed?: string[];
    fileUploaded?: boolean;
  },
) => {
  try {
    if (ownerWindow.pendo?.trackAgent) {
      ownerWindow.pendo.trackAgent(eventType, metadata);
    }
  } catch (error) {
    console.error("error during agent analytics", error);
  }
};
