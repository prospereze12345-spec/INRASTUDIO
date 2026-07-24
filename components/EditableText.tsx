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
  fieldId?: string;
  children?: ReactNode;
};

export const EditableText = forwardRef<HTMLElement, EditableTextProps>(function EditableText(
  { value, onChange, as: Tag = "span", editable = true, style, className, onFocusEl, onBlurEl, fieldId },
  forwardedRef
) {
  const innerRef = useRef<HTMLElement | null>(null);
  const isComposing = useRef(false);

  // Sole source of DOM text sync. Only runs while NOT focused, so it never
  // fights an in-progress edit — and it correctly seeds initial content on
  // mount, since activeElement !== el at that point.
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
      // NOTE: no children here — this is the fix. React must never own this
      // node's text content while it's editable; the ref effect above is the
      // only writer, and only when unfocused.
      onCompositionStart={() => { isComposing.current = true; }}
      onCompositionEnd={(e: React.CompositionEvent<HTMLElement>) => {
        isComposing.current = false;
        onChange(e.currentTarget.textContent ?? "");
      }}
      onInput={(e: React.FormEvent<HTMLElement>) => {
        if (isComposing.current) return;
        onChange(e.currentTarget.textContent ?? "");
      }}
      onFocus={(e: React.FocusEvent<HTMLElement>) => onFocusEl?.(e.currentTarget)}
      onBlur={onBlurEl}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (e.key === "Enter") e.preventDefault();
      }}
    />
  );
});