export const PENDO_VISITOR_ID_STORAGE_KEY = "pendo-visitor-id";

/**
 * Visitor id to initialize Pendo with: the value stored under
 * `PENDO_VISITOR_ID_STORAGE_KEY` in localStorage, or "" (Pendo then assigns an
 * anonymous `_PENDO_T_` id). Read once at startup, so set it before the page
 * loads, for example from an automation script.
 */
export const getPendoVisitorId = (): string => {
  try {
    return localStorage.getItem(PENDO_VISITOR_ID_STORAGE_KEY)?.trim() || "";
  } catch {
    return "";
  }
};
