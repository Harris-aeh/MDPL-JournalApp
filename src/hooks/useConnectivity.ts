import NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';

/**
 * Tracks online/offline status. Used to show an offline banner and to make the
 * app's offline-first behaviour visible to the user .
 */
export function useConnectivity(): boolean {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(Boolean(state.isConnected));
    });
    return unsubscribe;
  }, []);

  return isOnline;
}
