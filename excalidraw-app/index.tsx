import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";

import "../excalidraw-app/sentry";

import ExcalidrawApp from "./App";

// FORK: Novus by Pendo `location` transform, used by `initialize` below.
// The URL fragment is where Excalidraw keeps end-to-end encryption keys
// (`#room=<roomId>,<roomKey>`, `#json=<id>,<key>`) so they never reach a
// server, plus the library-install `token` and external scene URLs. Record
// only the parameter names (e.g. `#room`) so Pendo never captures a value.
const stripHashParamValues = (hash: string) => {
  const fragment = String(hash || "").replace(/^#/, "");
  if (!fragment.includes("=")) {
    return hash;
  }
  const names = fragment
    .split("&")
    .filter((param) => param.indexOf("=") > 0)
    .map((param) => param.split("=")[0]);
  return names.length ? `#${names.join("&")}` : "";
};

window.__EXCALIDRAW_SHA__ = import.meta.env.VITE_APP_GIT_SHA;

// FORK: Novus by Pendo: initialize once, anonymously (the app has no sign-in).
window.pendo?.initialize({
  visitor: { id: "" },
  location: {
    transforms: [
      { attr: "hash", action: "Replace", data: stripHashParamValues },
    ],
  },
});

const rootElement = document.getElementById("root")!;
const root = createRoot(rootElement);
registerSW();
root.render(
  <StrictMode>
    <ExcalidrawApp />
  </StrictMode>,
);
