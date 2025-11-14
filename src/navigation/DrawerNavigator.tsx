// src/navigation/DrawerNavigator.tsx
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { RootDrawerParamList } from './types';

import CameraScreen from '../screens/CameraScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Drawer = createDrawerNavigator<RootDrawerParamList>();

export function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Profile"
      screenOptions={{
        headerShown: true,
      }}
    >
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Meu Perfil',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-circle" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Camera"
        component={CameraScreen}
        options={{
          title: 'Tirar Foto',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="camera" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}