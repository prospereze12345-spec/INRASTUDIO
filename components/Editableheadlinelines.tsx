"use client";

import { Fragment, type ReactNode } from "react";
import { EditableText } from "./EditableText";

type EditableHeadlineLinesProps = {
  /** The full headline, lines joined with '\n' — same shape FlyerState already stores. */
  value: string;
  onChange?: (v: string) => void;
  editable?: boolean;
  onFocusEl?: (el: HTMLElement) => void;
  onBlurEl?: () => void;
  fieldIdPrefix?: string;
  /**
   * Called once per line. Receives the raw line text (for conditional styling
   * decisions, e.g. "color this line the accent color") and the already-wired
   * editable node to render in its place.
   */
  renderLine: (line: string, index: number, editableNode: ReactNode) => ReactNode;
};

/**
 * Many templates split `headline` on '\n' and style each line differently
 * (e.g. line 1 in white, line 2 in the accent color). A single contentEditable
 * block over the whole headline would lose that structural split as soon as
 * someone types past a line boundary.
 *
 * This component keeps each line independently editable — editing a line
 * updates just that index and rejoins with '\n' — so the line count (and
 * therefore the per-line styling) stays stable while the text stays fully
 * editable in place on the canvas.
 */
export function EditableHeadlineLines({
  value,
  onChange,
  editable,
  onFocusEl,
  onBlurEl,
  fieldIdPrefix = "f-headline",
  renderLine,
}: EditableHeadlineLinesProps) {
  const lines = value.split("\n");

  const setLine = (index: number, newText: string) => {
    if (!onChange) return;
    const next = [...lines];
    next[index] = newText;
    onChange(next.join("\n"));
  };

  return (
    <>
      {lines.map((line, i) => {
        const editableNode = (
          <EditableText
            as="span"
            fieldId={`${fieldIdPrefix}-${i}`}
            editable={editable}
            value={line}
            onChange={(v) => setLine(i, v)}
            onFocusEl={onFocusEl}
            onBlurEl={onBlurEl}
          />
        );
        return <Fragment key={i}>{renderLine(line, i, editableNode)}</Fragment>;
      })}
    </>
  );
}
