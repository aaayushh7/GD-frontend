import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';

class GeolocationService {
  constructor() {
    this.isNative = Capacitor.isNativePlatform();
  }

  async getCurrentPosition() {
    try {
      if (this.isNative) {
        // Request permissions
        const permissions = await Geolocation.requestPermissions();
        
        if (permissions.location === 'granted') {
          const position = await Geolocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 10000
          });
          
          return {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          };
        } else {
          throw new Error('Location permission denied');
        }
      } else {
        // Web fallback
        return new Promise((resolve, reject) => {
          if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported'));
            return;
          }

          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy
              });
            },
            (error) => {
              reject(error);
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 60000
            }
          );
        });
      }
    } catch (error) {
      console.error('Error getting location:', error);
      throw error;
    }
  }

  async watchPosition(callback) {
    if (this.isNative) {
      const watchId = await Geolocation.watchPosition(
        {
          enableHighAccuracy: true,
          timeout: 10000
        },
        callback
      );
      return watchId;
    } else {
      // Web fallback
      const watchId = navigator.geolocation.watchPosition(
        callback,
        (error) => console.error('Watch position error:', error),
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
      return watchId;
    }
  }

  async clearWatch(watchId) {
    if (this.isNative) {
      await Geolocation.clearWatch({ id: watchId });
    } else {
      navigator.geolocation.clearWatch(watchId);
    }
  }
}

export default new GeolocationService();