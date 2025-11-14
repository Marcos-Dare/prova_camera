// src/navigation/StackNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './types';

import CameraScreen from '../screens/CameraScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createStackNavigator<RootStackParamList>();

export function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Camera">
      <Stack.Screen
        name="Camera"
        component={CameraScreen}
        options={{
          title: 'Tirar Foto',
        }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Meu Perfil',
        }}
      />
    </Stack.Navigator>
  );
}