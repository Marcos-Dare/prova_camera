// src/navigation/types.ts
import { StackScreenProps } from '@react-navigation/stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { useNavigation as useDefaultNavigation } from '@react-navigation/native';

type CommonScreenParams = {
  Camera: undefined;
  Profile: { photoUri?: string };
};

export type RootStackParamList = CommonScreenParams;

export type StackProps<T extends keyof RootStackParamList> = StackScreenProps<
  RootStackParamList,
  T
>;

export type RootTabParamList = CommonScreenParams;

export type TabProps<T extends keyof RootTabParamList> = BottomTabScreenProps<
  RootTabParamList,
  T
>;

export type RootDrawerParamList = CommonScreenParams;

export type DrawerProps<T extends keyof RootDrawerParamList> = DrawerScreenProps<
  RootDrawerParamList,
  T
>;

export const useNavigation = () => {
  return useDefaultNavigation<StackScreenProps<RootStackParamList>['navigation']>();
};