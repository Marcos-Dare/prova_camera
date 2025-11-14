// src/screens/CameraScreen.tsx
import React, { useState, useRef } from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import { Camera, CameraView, useCameraPermissions } from 'expo-camera';

import { DrawerProps } from '../navigation/types';
// import { StackProps } from '../navigation/types';
// import { TabProps } from '../navigation/types';

type Props = DrawerProps<'Camera'>;
// type Props = StackProps<'Camera'>;
// type Props = TabProps<'Camera'>;

export default function CameraScreen({ navigation }: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>Precisamos de permissão para usar a câmera.</Text>
        <Button onPress={requestPermission} title="Conceder Permissão" />
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({ quality: 0.5 });
        if (photo) {
          navigation.navigate('Profile', { photoUri: photo.uri });
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef} facing="front" />
      <Button title="Tirar Foto" onPress={takePicture} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center' },
  camera: { height: 400, width: '100%' },
});