import { PushNotifications } from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

class NotificationService {
  constructor() {
    this.isNative = Capacitor.isNativePlatform();
    if (this.isNative) {
      this.initializePushNotifications();
    }
  }

  async initializePushNotifications() {
    // Request permission to use push notifications
    const permStatus = await PushNotifications.requestPermissions();

    if (permStatus.receive === 'granted') {
      // Register with Apple / Google to receive push via APNS/FCM
      await PushNotifications.register();
    }

    // On success, we should be able to receive notifications
    PushNotifications.addListener('registration', (token) => {
      console.log('Push registration success, token: ' + token.value);
      // Send token to your backend
      this.sendTokenToBackend(token.value);
    });

    // Some issue with our setup and push will not work
    PushNotifications.addListener('registrationError', (error) => {
      console.error('Error on registration: ' + JSON.stringify(error));
    });

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('Push received: ' + JSON.stringify(notification));
      this.showLocalNotification(notification.title, notification.body);
    });

    // Method called when tapping on a notification
    PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
      console.log('Push action performed: ' + JSON.stringify(notification));
      // Handle notification tap
      this.handleNotificationTap(notification);
    });
  }

  async sendTokenToBackend(token) {
    try {
      // Send the token to your backend
      const response = await fetch('https://api.cravehub.store/api/users/device-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
        credentials: 'include'
      });
      
      if (response.ok) {
        console.log('Token sent to backend successfully');
      }
    } catch (error) {
      console.error('Error sending token to backend:', error);
    }
  }

  async showLocalNotification(title, body) {
    if (!this.isNative) return;

    await LocalNotifications.schedule({
      notifications: [
        {
          title: title || 'CraveHub',
          body: body || 'You have a new notification',
          id: Date.now(),
          schedule: { at: new Date(Date.now() + 1000 * 1) },
          sound: 'beep.wav',
          attachments: undefined,
          actionTypeId: "",
          extra: null
        }
      ]
    });
  }

  handleNotificationTap(notification) {
    // Handle different notification types
    const data = notification.notification.data;
    
    if (data.type === 'order_update') {
      // Navigate to order details
      window.location.href = `/order/${data.orderId}`;
    } else if (data.type === 'promotion') {
      // Navigate to shop
      window.location.href = '/shop';
    }
  }

  async scheduleOrderNotification(orderId, estimatedDelivery) {
    if (!this.isNative) return;

    const deliveryTime = new Date(estimatedDelivery);
    const reminderTime = new Date(deliveryTime.getTime() - 5 * 60 * 1000); // 5 minutes before

    await LocalNotifications.schedule({
      notifications: [
        {
          title: 'Order Update',
          body: 'Your order will be delivered in 5 minutes!',
          id: parseInt(orderId.slice(-6)),
          schedule: { at: reminderTime },
          extra: { orderId, type: 'delivery_reminder' }
        }
      ]
    });
  }
}

export default new NotificationService();