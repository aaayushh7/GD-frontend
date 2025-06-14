import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Keyboard } from '@capacitor/keyboard';
import { App } from '@capacitor/app';

export const useCapacitor = () => {
  const [isNative, setIsNative] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState(null);

  useEffect(() => {
    const initializeCapacitor = async () => {
      const native = Capacitor.isNativePlatform();
      setIsNative(native);

      if (native) {
        // Configure status bar
        await StatusBar.setStyle({ style: Style.Light });
        await StatusBar.setBackgroundColor({ color: '#FFF6E3' });

        // Hide splash screen after app loads
        await SplashScreen.hide();

        // Configure keyboard
        Keyboard.addListener('keyboardWillShow', info => {
          document.body.style.transform = `translateY(-${info.keyboardHeight}px)`;
        });

        Keyboard.addListener('keyboardWillHide', () => {
          document.body.style.transform = 'translateY(0px)';
        });

        // Handle app state changes
        App.addListener('appStateChange', ({ isActive }) => {
          console.log('App state changed. Is active?', isActive);
        });

        // Handle back button
        App.addListener('backButton', ({ canGoBack }) => {
          if (!canGoBack) {
            App.exitApp();
          } else {
            window.history.back();
          }
        });
      }
    };

    initializeCapacitor();
  }, []);

  return { isNative, deviceInfo };
};