/**
 * This hook is deprecated. The app now only supports light theme.
 * This hook is kept for backward compatibility and always returns 'light'.
 */

export function useColorScheme(): 'light' {
  // Show deprecation warning in development
  if (process.env.NODE_ENV !== 'production') {
    console.warn(
      'useColorScheme is deprecated. The app now only supports light theme.'
    );
  }
  
  return 'light';
}
