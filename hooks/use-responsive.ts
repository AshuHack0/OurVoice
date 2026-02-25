import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

const BASE_WIDTH = 390;
const MIN_PADDING = 16;
const MAX_PADDING = 28;
const MAX_CONTENT_WIDTH_MOBILE = 560;
/** Desktop/web: use more horizontal space */
const MAX_CONTENT_WIDTH_DESKTOP = 960;
const DESKTOP_BREAKPOINT = 768;

/**
 * Responsive layout values that update on orientation/screen size change.
 * Use for padding, max widths, and any dimension that should scale with the window.
 */
export function useResponsive() {
  const { width, height } = useWindowDimensions();

  return useMemo(() => {
    const paddingHorizontal = Math.min(
      MAX_PADDING,
      Math.max(MIN_PADDING, Math.round(width * 0.052))
    );
    const scale = width / BASE_WIDTH;
    const isNarrow = width < 380;
    const isWide = width > 500;
    const isDesktop = width >= DESKTOP_BREAKPOINT;
    const maxContentWidth = isDesktop
      ? Math.min(width, MAX_CONTENT_WIDTH_DESKTOP)
      : Math.min(width, MAX_CONTENT_WIDTH_MOBILE);

    return {
      width,
      height,
      paddingHorizontal,
      maxContentWidth,
      scale,
      isNarrow,
      isWide,
      isDesktop,
    };
  }, [width, height]);
}
