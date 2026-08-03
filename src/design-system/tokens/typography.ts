/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const typography = {
  display: "font-display font-black tracking-tight leading-[1.05] text-stone-900",
  displayXL: "font-display font-black tracking-tight leading-[1.02] text-stone-900 text-4xl md:text-6xl",
  displayL: "font-display font-black tracking-tight leading-[1.05] text-stone-900 text-3xl md:text-5xl",
  h1: "font-display font-black tracking-tight leading-[1.1] text-stone-900 text-3xl md:text-4xl",
  h2: "font-display font-extrabold tracking-tight leading-[1.2] text-stone-900 text-2xl md:text-3xl",
  h3: "font-display font-bold tracking-tight leading-[1.25] text-stone-900 text-xl md:text-2xl",
  h4: "font-display font-bold tracking-tight leading-[1.3] text-stone-900 text-lg",
  bodyL: "font-sans text-base md:text-lg leading-relaxed text-stone-600 font-medium",
  body: "font-sans text-sm md:text-base leading-relaxed text-stone-500 font-medium",
  small: "font-sans text-xs md:text-sm leading-normal text-stone-600 font-medium",
  caption: "font-sans text-xs text-stone-400 font-medium",
  label: {
    mono: "font-mono text-[10px] font-bold text-stone-400 uppercase tracking-widest block select-none",
    interactive: "font-sans text-xs font-bold uppercase tracking-wider select-none",
  }
};
export type TypographyKey = keyof Omit<typeof typography, 'label'>;
