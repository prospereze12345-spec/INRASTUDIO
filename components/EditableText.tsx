"use client";

import { useRef, useEffect, forwardRef } from "react";
import type { ElementType, CSSProperties, ReactNode } from "react";

export type EditableTextProps = {
  value: string;
  onChange?: (v: string) => void;
  as?: ElementType;
  editable?: boolean;
  style?: CSSProperties;
  className?: string;
  onFocusEl?: (el: HTMLElement) => void;
  onBlurEl?: () => void;
  /** Stable id so the floating toolbar / free-text tool can target this node in the DOM. */
  fieldId?: string;
  children?: ReactNode;
};

/**
 * The single text primitive every flyer template should render through.
 *
 * - When `editable` is false (or `onChange` is omitted), it's a plain,
 *   non-interactive element — this is what the Templates gallery previews use.
 * - When editable, it becomes a controlled contentEditable node wired into the
 *   flyer's field-update flow, so clicking text in the actual editor canvas
 *   edits the *real* template the user picked instead of a generic stand-in.
 *
 * Enter is swallowed so a single logical field (a price, a CTA, one line of
 * a headline) can never accidentally grow extra lines and break the layout
 * math (cqi-based font sizing, line clamping, etc.) that the design assumes.
 */
export const EditableText = forwardRef<HTMLElement, EditableTextProps>(function EditableText(
  { value, onChange, as: Tag = "span", editable = true, style, className, onFocusEl, onBlurEl, fieldId },
  forwardedRef
) {
  const innerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = innerRef.current;
    if (el && document.activeElement !== el && el.textContent !== value) {
      el.textContent = value;
    }
  }, [value]);

  const setRef = (node: HTMLElement | null) => {
    innerRef.current = node;
    if (typeof forwardedRef === "function") forwardedRef(node as HTMLElement);
    else if (forwardedRef) (forwardedRef as React.MutableRefObject<HTMLElement | null>).current = node;
  };

  if (!editable || !onChange) {
    const StaticTag = Tag as ElementType;
    return (
      <StaticTag style={style} className={className}>
        {value}
      </StaticTag>
    );
  }

  const EditableTag = Tag as ElementType;

  return (
    <EditableTag
      ref={setRef}
      id={fieldId}
      data-field={fieldId}
      contentEditable
      suppressContentEditableWarning
      className={className}
      style={{ outline: "none", cursor: "text", ...style }}
      onInput={(e: React.FormEvent<HTMLElement>) => onChange((e.currentTarget.textContent ?? ""))}
      onFocus={(e: React.FocusEvent<HTMLElement>) => onFocusEl?.(e.currentTarget)}
      onBlur={onBlurEl}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (e.key === "Enter") e.preventDefault();
      }}
    >
      {value}
    </EditableTag>
  );
});
