// src/screens/CameraScreen.tsx
import React, { useState, useRef } from 'react';
import { View, Button, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Camera, CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons'; // Usaremos ícones para os botões

//import { DrawerProps } from '../navigation/types';
 //import { StackProps } from '../navigation/types';
 import { TabProps } from '../navigation/types';

//type Props = DrawerProps<'Camera'>;
//type Props = StackProps<'Camera'>;
type Props = TabProps<'Camera'>;

export default function CameraScreen({ navigation }: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  // --- NOVOS ESTADOS PARA CONFIGURAR A CÂMERA ---
  
  // 1. Estado para controlar qual câmera usar (frontal ou traseira)
  const [facing, setFacing] = useState<'front' | 'back'>('front');
  
  // 2. Estado para controlar o flash
  const [flash, setFlash] = useState<'off' | 'on' | 'auto'>('off');

  // --- LÓGICA DE PERMISSÃO (igual a antes) ---
  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text>Precisamos de permissão para usar a câmera.</Text>
        <Button onPress={requestPermission} title="Conceder Permissão" />
      </View>
    );
  }

  // --- NOVAS FUNÇÕES DE CONTROLE ---

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({ quality: 0.5, shutterSound:false });
        if (photo) {
          navigation.navigate('Profile', { photoUri: photo.uri });
        }
      } catch (e) {
        console.error(e);
        Alert.alert('Erro', 'Não foi possível tirar a foto.');
      }
    }
  };

  const onFlipCamera = () => {
    // Alterna entre 'front' e 'back'
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const onToggleFlash = () => {
    // Cicla entre 'off', 'on', 'auto'
    if (flash === 'off') setFlash('on');
    else if (flash === 'on') setFlash('auto');
    else setFlash('off');
  };

  // --- RENDERIZAÇÃO COM OVERLAY ---
  
  return (
    <View style={styles.container}>
      {/* CAMADA 1: A Câmera (ocupa tudo) */}
      <CameraView 
        style={styles.camera} 
        ref={cameraRef}
        facing={facing} // Prop 'facing' controlada pelo estado
        flash={flash}   // Prop 'flash' controlada pelo estado
        // Outras props: zoom, barcodeScanner, etc.
      />

      {/* CAMADA 2: O Overlay de Controles */}
      <View style={styles.overlayContainer}>
        
        {/* Botão de Flash */}
        <TouchableOpacity style={styles.iconButton} onPress={onToggleFlash}>
          <Ionicons 
            name={flash === 'on' ? 'flash' : (flash === 'auto' ? 'flash-outline' : 'flash-off')} 
            size={30} 
            color="white" 
          />
          <Text style={styles.iconText}>{flash}</Text>
        </TouchableOpacity>

        {/* Botão Disparador (Shutter) */}
        <TouchableOpacity style={styles.shutterButton} onPress={takePicture} />

        {/* Botão de Virar Câmera */}
        <TouchableOpacity style={styles.iconButton} onPress={onFlipCamera}>
          <Ionicons name="camera-reverse" size={30} color="white" />
        </TouchableOpacity>

      </View>
    </View>
  );
}

// --- NOVOS ESTILOS PARA O OVERLAY ---

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center',
    backgroundColor: 'black', // Fundo preto para preencher
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1, // Faz a câmera ocupar o espaço disponível
  },
  overlayContainer: {
    // Este é o truque: posicionamento absoluto
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    // Estilos do container
    height: 120,
    backgroundColor: 'rgba(0,0,0,0.4)', // Fundo semi-transparente
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around', // Espaça os 3 botões
  },
  shutterButton: {
    width: 70,
    height: 70,
    borderRadius: 35, // Círculo perfeito
    backgroundColor: 'white',
    borderWidth: 4,
    borderColor: '#ccc',
  },
  iconButton: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  }
});