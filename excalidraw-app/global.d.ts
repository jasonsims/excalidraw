import "@excalidraw/excalidraw/global";
import "@excalidraw/excalidraw/css";

interface Window {
  __EXCALIDRAW_SHA__: string | undefined;
}

declare global {
  // Novus by Pendo web SDK, defined by the install snippet in index.html.
  // Typed for the options this app passes; extend as more of the SDK is used.
  const pendo: {
    initialize: (options: {
      visitor: { id: string };
      location?: {
        transforms: {
          attr: "hash";
          action: "Replace";
          data: (hash: string, url: URL) => string;
        }[];
      };
    }) => void;
  };
}
