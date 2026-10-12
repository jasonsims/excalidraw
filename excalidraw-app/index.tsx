import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";

import "../excalidraw-app/sentry";

import ExcalidrawApp from "./App";

window.__EXCALIDRAW_SHA__ = import.meta.env.VITE_APP_GIT_SHA;

// Collaboration (`#room=<id>,<key>`) and shareable (`#json=<id>,<key>`) links
// carry the scene's encryption key in the hash: everything after the id, up to
// the next `&`, is key material.
const ENCRYPTION_KEY_IN_HASH = /(^#|&)(room|json)=([a-zA-Z0-9_-]*)[^&]*/g;

// Novus by Pendo. `pendo` is defined by the install snippet in index.html; the
// check keeps analytics from ever stopping the app from rendering.
if (typeof pendo !== "undefined") {
  pendo.initialize({
    visitor: { id: "" },
    location: {
      transforms: [
        {
          // Drop the encryption key from the URL Pendo records and keep the
          // rest of the hash, which identifies the room or shared scene.
          attr: "hash",
          action: "Replace",
          data: (hash) =>
            String(hash || "").replace(ENCRYPTION_KEY_IN_HASH, "$1$2=$3"),
        },
      ],
    },
  });
}

const rootElement = document.getElementById("root")!;
const root = createRoot(rootElement);
registerSW();
root.render(
  <StrictMode>
    <ExcalidrawApp />
  </StrictMode>,
);
