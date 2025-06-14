import React, { useState } from 'react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Share } from '@capacitor/share';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { toast } from 'react-toastify';

const NativeFeatures = () => {
  const [photo, setPhoto] = useState(null);
  const isNative = Capacitor.isNativePlatform();

  const triggerHaptic = async (style = ImpactStyle.Medium) => {
    if (isNative) {
      await Haptics.impact({ style });
    }
  };

  const shareContent = async (title, text, url) => {
    try {
      if (isNative) {
        await Share.share({
          title,
          text,
          url,
          dialogTitle: 'Share with friends'
        });
      } else {
        // Web fallback
        if (navigator.share) {
          await navigator.share({ title, text, url });
        } else {
          // Copy to clipboard fallback
          await navigator.clipboard.writeText(`${title}\n${text}\n${url}`);
          toast.success('Link copied to clipboard!');
        }
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const openExternalLink = async (url) => {
    if (isNative) {
      await Browser.open({ url });
    } else {
      window.open(url, '_blank');
    }
  };

  const takePhoto = async () => {
    try {
      if (isNative) {
        const image = await Camera.getPhoto({
          quality: 90,
          allowEditing: false,
          resultType: CameraResultType.Uri,
          source: CameraSource.Camera
        });

        setPhoto(image.webPath);
      } else {
        toast.info('Camera feature is only available in the mobile app');
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      toast.error('Failed to take photo');
    }
  };

  return {
    triggerHaptic,
    shareContent,
    openExternalLink,
    takePhoto,
    photo,
    isNative
  };
};

export default NativeFeatures;