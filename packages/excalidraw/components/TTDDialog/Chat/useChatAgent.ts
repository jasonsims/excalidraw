import { randomId } from "@excalidraw/common";

import { useAtom } from "../../../editor-jotai";
import { chatHistoryAtom } from "../../TTDDialog/TTDContext";
import {
  addMessages,
  updateAssistantContent,
} from "../../TTDDialog/utils/chat";

export const useChatAgent = () => {
  const [chatHistory, setChatHistory] = useAtom(chatHistoryAtom);

  /** @returns id of the added message */
  const addUserMessage = (content: string) => {
    const id = randomId();
    setChatHistory((prev) =>
      addMessages(prev, [
        {
          id,
          type: "user",
          content,
        },
      ]),
    );
    return id;
  };

  /** @returns id of the added message */
  const addAssistantMessage = () => {
    const id = randomId();
    setChatHistory((prev) =>
      addMessages(prev, [
        {
          id,
          type: "assistant",
          content: "",
          isGenerating: true,
        },
      ]),
    );
    return id;
  };

  const setLastRetryAttempt = () => {
    setChatHistory((prev) =>
      updateAssistantContent(prev, {
        lastAttemptAt: Date.now(),
      }),
    );
  };

  const setAssistantError = (
    errorMessage: string,
    errorType: "parse" | "network" | "other" = "other",
    errorDetails?: Error | unknown,
  ) => {
    const serializedErrorDetails = errorDetails
      ? JSON.stringify({
          name: errorDetails instanceof Error ? errorDetails.name : "Error",
          message:
            errorDetails instanceof Error
              ? errorDetails.message
              : String(errorDetails),
          stack: errorDetails instanceof Error ? errorDetails.stack : undefined,
        })
      : undefined;

    setChatHistory((prev) =>
      updateAssistantContent(prev, {
        isGenerating: false,
        error: errorMessage,
        errorType,
        errorDetails: serializedErrorDetails,
      }),
    );
  };

  return {
    addUserMessage,
    addAssistantMessage,
    setAssistantError,
    chatHistory,
    setChatHistory,
    setLastRetryAttempt,
  };
};
