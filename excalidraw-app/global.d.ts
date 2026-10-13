import "@excalidraw/excalidraw/global";
import "@excalidraw/excalidraw/css";

interface Window {
  __EXCALIDRAW_SHA__: string | undefined;
}

// Novus by Pendo web SDK, defined on `window` by the install snippet in
// index.html. Typed narrowly to what the app calls: an invalid `location`
// transform attr/action pair throws inside `initialize`, so extend these
// types deliberately.
type PendoHashTransform = {
  attr: "hash";
  action: "Replace";
  data: (hash: string, url: URL) => string;
};

type Pendo = {
  initialize: (options: {
    visitor: { id: string };
    location?: { transforms: readonly PendoHashTransform[] };
  }) => void;
};

declare global {
  interface Window {
    pendo?: Pendo;
  }
}
