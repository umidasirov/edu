import { useCallback } from "react";
import { useBlocker } from "./useBlocker";

export function usePrompt(when, blockerCallback) {
  const blocker = useCallback(
    (tx) => {
      blockerCallback(tx);
    },
    [blockerCallback]
  );

  useBlocker(blocker, when);
}
