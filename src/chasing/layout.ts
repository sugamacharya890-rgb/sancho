import {useVideoConfig} from 'remotion';

/**
 * Layout switch for the Script 02 scenes: the same components render the 16:9 cut and the
 * 9:16 phone cut (Instagram Reels / Stories / TikTok). `pick(landscape, vertical)`.
 * Vertical safe zone: keep key content between y≈250 and y≈1600 (Reels UI covers top/bottom).
 */
export const useLayout = () => {
  const {width: W, height: H} = useVideoConfig();
  const vertical = H > W;
  return {W, H, vertical, pick: <T,>(landscape: T, portrait: T): T => (vertical ? portrait : landscape)};
};
