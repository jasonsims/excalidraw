import { actionClearCanvas } from "../actions";
import {
  getImageFileCount,
  getNonDeletedElementCount,
  trackPendoEvent,
} from "../analytics";
import { atom, useAtom } from "../editor-jotai";
import { t } from "../i18n";

import { useApp, useExcalidrawActionManager } from "./App";
import ConfirmDialog from "./ConfirmDialog";

export const activeConfirmDialogAtom = atom<{
  name: "clearCanvas";
  /** where the dialog was opened from (analytics only) */
  entryPoint: "main_menu" | "command_palette" | "keyboard";
} | null>(null);

export const ActiveConfirmDialog = () => {
  const [activeConfirmDialog, setActiveConfirmDialog] = useAtom(
    activeConfirmDialogAtom,
  );
  const actionManager = useExcalidrawActionManager();
  const app = useApp();

  if (!activeConfirmDialog) {
    return null;
  }

  if (activeConfirmDialog.name === "clearCanvas") {
    return (
      <ConfirmDialog
        onConfirm={() => {
          const elements = app.scene.getElementsIncludingDeleted();
          const deletedElementCount = getNonDeletedElementCount(elements);
          const imageFileCount = getImageFileCount(elements);

          actionManager.executeAction(actionClearCanvas);
          setActiveConfirmDialog(null);

          trackPendoEvent("canvas_cleared", {
            deletedElementCount,
            imageFileCount,
            isCollaborating: app.props.isCollaborating,
            entryPoint: activeConfirmDialog.entryPoint,
          });
        }}
        onCancel={() => setActiveConfirmDialog(null)}
        title={t("clearCanvasDialog.title")}
      >
        <p className="clear-canvas__content"> {t("alerts.clearReset")}</p>
      </ConfirmDialog>
    );
  }

  return null;
};
