import type { ReactNode } from "react";

export const highlightTag = {
  highlight: (chunks: ReactNode) => (
    <span className="text-red-500">{chunks}</span>
  ),
};
