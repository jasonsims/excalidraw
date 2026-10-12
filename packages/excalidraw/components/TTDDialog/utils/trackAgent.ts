type PendoTrackAgent = NonNullable<NonNullable<Window["pendo"]>["trackAgent"]>;

/** Pendo agent id of the text-to-diagram chat */
const TTD_AGENT_ID = "EL-o0jX0lutB47fW5EzrgQxs9eI";

/**
 * Tracks a text-to-diagram chat interaction via Pendo's `trackAgent()`.
 * No-op if Pendo isn't installed on the host page.
 */
export const trackAgentEvent = (
  ownerWindow: Window,
  eventType: Parameters<PendoTrackAgent>[0],
  metadata: Omit<Parameters<PendoTrackAgent>[1], "agentId">,
) => {
  try {
    ownerWindow.pendo?.trackAgent?.(eventType, {
      ...metadata,
      agentId: TTD_AGENT_ID,
    });
  } catch (error) {
    console.error("error during pendo trackAgent", error);
  }
};
