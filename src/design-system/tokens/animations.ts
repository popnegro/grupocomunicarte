/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const animations = {
  transitions: {
    smooth: { type: "spring", stiffness: 300, damping: 30 },
    bouncy: { type: "spring", stiffness: 400, damping: 20 },
    fade: { duration: 0.2, ease: "easeInOut" },
  },
  hover: "transition-all duration-300 ease-in-out",
};
