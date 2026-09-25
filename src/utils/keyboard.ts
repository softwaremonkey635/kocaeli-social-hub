import React from 'react';

/**
 * Props that make a click-only container behave like a button for keyboard
 * users: focusable, announced as a button, activates on Enter or Space.
 *
 * Only spread this on containers with NO nested interactive children, a nested
 * <button> inside role="button" trips axe's `nested-interactive` rule. Cards
 * that wrap real buttons keep their inner buttons as the keyboard path.
 */
export function buttonProps(onActivate: () => void, label?: string) {
  return {
    role: 'button' as const,
    tabIndex: 0,
    'aria-label': label,
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onActivate();
      }
    }
  };
}
