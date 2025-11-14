// App.tsx
import 'react-native-gesture-handler'; // Mantenha no topo!
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

// --- ESCOLHA SEU NAVEGADOR AQUI ---
// import { StackNavigator } from './src/navigation/StackNavigator';
// import { TabNavigator } from './src/navigation/TabNavigator';
import { DrawerNavigator } from './src/navigation/DrawerNavigator';

export default function App() {
  return (
    <NavigationContainer>
      {/* Na hora da prova, é só trocar a linha abaixo */}
      <DrawerNavigator /> 
    </NavigationContainer>
  );
}