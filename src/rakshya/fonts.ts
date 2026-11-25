// Bundled locally via @fontsource so renders never depend on network font loading.
import '@fontsource/instrument-serif/400.css';
import '@fontsource/instrument-serif/400-italic.css';
import '@fontsource/noto-serif-devanagari/400.css';
import '@fontsource/noto-serif-devanagari/500.css';
import '@fontsource/noto-serif-devanagari/600.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';

/** Editorial serif display; Devanagari glyphs (रक्षा) fall through to Noto Serif Devanagari. */
export const SERIF = `'Instrument Serif', 'Noto Serif Devanagari', Georgia, serif`;
export const DEVANAGARI = `'Noto Serif Devanagari', 'Instrument Serif', serif`;
export const SANS = `'Inter', system-ui, sans-serif`;
