import { InMemoryProfileRepository } from '../repositories/InMemoryProfileRepository'; 
const profileRepository = InMemoryProfileRepository.getInstance();
// src/screens/ProfileScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Button, 
  Image, 
  StyleSheet, 
  Text, 
  Alert, 
  FlatList, 
  TouchableOpacity 
} from 'react-native';

import { DrawerProps } from '../navigation/types';
// import { StackProps } from '../navigation/types';
// import { TabProps } from '../navigation/types';

type Props = DrawerProps<'Profile'>;
// type Props = StackProps<'Profile'>;
// type Props = TabProps<'Profile'>;

export default function ProfileScreen({ route }: Props) {
  const newPhotoUriFromCamera = route.params?.photoUri;

  const [currentDisplayPhotoUri, setCurrentDisplayPhotoUri] = useState<string | null>(null);
  const [savedPhotos, setSavedPhotos] = useState<string[]>([]);
  const [isNewPhotoUnsaved, setIsNewPhotoUnsaved] = useState(false);

  const loadPhotos = useCallback(async () => {
    try {
      const allPhotos = await profileRepository.loadAllPhotos();
      setSavedPhotos(allPhotos);
      const currentPhoto = await profileRepository.loadCurrentPhoto();

      if (newPhotoUriFromCamera) {
        const isAlreadySaved = allPhotos.includes(newPhotoUriFromCamera);
        setCurrentDisplayPhotoUri(newPhotoUriFromCamera);
        setIsNewPhotoUnsaved(!isAlreadySaved);
      } else if (currentPhoto) {
        setCurrentDisplayPhotoUri(currentPhoto);
      } else if (allPhotos.length > 0) {
        setCurrentDisplayPhotoUri(allPhotos[0]);
      } else {
        setCurrentDisplayPhotoUri(null);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível carregar as fotos.');
    }
  }, [newPhotoUriFromCamera]);

  useEffect(() => {
    loadPhotos();
  }, [loadPhotos]);

  const handleSaveNewPhoto = async () => {
    if (newPhotoUriFromCamera && isNewPhotoUnsaved) {
      try {
        await profileRepository.addPhoto(newPhotoUriFromCamera);
        await profileRepository.setCurrentPhoto(newPhotoUriFromCamera);
        setIsNewPhotoUnsaved(false);
        
        const allPhotos = await profileRepository.loadAllPhotos();
        setSavedPhotos(allPhotos);
        
        Alert.alert('Sucesso', 'Foto adicionada à sua coleção!');
      } catch (error) {
        console.error(error);
        Alert.alert('Erro', 'Não foi possível salvar a nova foto.');
      }
    }
  };

  const handleSetAsCurrent = async (uri: string) => {
    try {
      await profileRepository.setCurrentPhoto(uri);
      setCurrentDisplayPhotoUri(uri);
      setIsNewPhotoUnsaved(false);
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível definir esta foto como principal.');
    }
  };

  const handleRemovePhoto = async (uriToRemove: string | null) => {
    if (!uriToRemove) return;

    Alert.alert(
      "Remover Foto",
      "Tem certeza que deseja remover esta foto permanentemente?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Remover", 
          style: "destructive", 
          onPress: async () => {
            try {
              await profileRepository.removePhoto(uriToRemove);
              
              if (uriToRemove === newPhotoUriFromCamera) {
                setIsNewPhotoUnsaved(false);
              }

              const updatedPhotos = await profileRepository.loadAllPhotos();
              setSavedPhotos(updatedPhotos);

              if (currentDisplayPhotoUri === uriToRemove) {
                const newCurrent = updatedPhotos.length > 0 ? updatedPhotos[0] : null;
                setCurrentDisplayPhotoUri(newCurrent);
                await profileRepository.setCurrentPhoto(newCurrent || '');
              }
              
              Alert.alert('Sucesso', 'Foto removida.');
            } catch (error) {
              console.error(error);
              Alert.alert('Erro', 'Não foi possível remover a foto.');
            }
          }
        }
      ]
    );
  };

  const showSaveButton = isNewPhotoUnsaved && currentDisplayPhotoUri === newPhotoUriFromCamera;
  const showDeleteButton = currentDisplayPhotoUri && !isNewPhotoUnsaved && savedPhotos.includes(currentDisplayPhotoUri);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minha Foto</Text>
      
      {currentDisplayPhotoUri ? (
        <Image source={{ uri: currentDisplayPhotoUri }} style={styles.mainImage} />
      ) : (
        <View style={styles.mainImagePlaceholder}>
          <Text style={styles.noPhotoText}>Tire uma foto na Câmera</Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        {showSaveButton && (
          <Button
            title="Salvar esta Foto"
            onPress={handleSaveNewPhoto}
            color="#007AFF"
          />
        )}
        {showDeleteButton && (
          <Button
            title="Excluir Foto Atual"
            onPress={() => handleRemovePhoto(currentDisplayPhotoUri)}
            color="#FF3B30"
          />
        )}
      </View>

      <Text style={styles.subtitle}>Minhas Fotos Salvas</Text>
      
      {savedPhotos.length > 0 ? (
        <FlatList
          data={savedPhotos}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item: photoUri }) => (
            <TouchableOpacity 
              style={[
                styles.thumbnailContainer, 
                currentDisplayPhotoUri === photoUri && !isNewPhotoUnsaved && styles.thumbnailSelected
              ]}
              onPress={() => handleSetAsCurrent(photoUri)}
              onLongPress={() => handleRemovePhoto(photoUri)} 
            >
              <Image source={{ uri: photoUri }} style={styles.thumbnail} />
            </TouchableOpacity>
          )}
          style={styles.photoList}
        />
      ) : (
        <Text style={styles.noPhotoListText}>Nenhuma foto salva ainda.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    alignItems: 'center', 
    paddingTop: 20, 
    backgroundColor: '#f0f0f0' 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 15, 
    color: '#333' 
  },
  mainImage: { 
    width: 300, 
    height: 300, 
    borderRadius: 15, 
    marginBottom: 10, 
    borderWidth: 2, 
    borderColor: '#ccc' 
  },
  mainImagePlaceholder: {
    width: 300, 
    height: 300, 
    borderRadius: 15, 
    marginBottom: 10, 
    borderWidth: 2,
    borderColor: '#ccc', 
    backgroundColor: '#e0e0e0',
    alignItems: 'center', 
    justifyContent: 'center'
  },
  noPhotoText: { 
    fontSize: 16, 
    color: '#666' 
  },
  buttonContainer: {
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
    minHeight: 40
  },
  subtitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginTop: 10, 
    marginBottom: 15, 
    color: '#333' 
  },
  photoList: {
    paddingVertical: 10,
    maxHeight: 120,
  },
  thumbnailContainer: {
    marginHorizontal: 5,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  thumbnailSelected: {
    borderColor: '#007AFF',
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 5,
  },
  noPhotoListText: { 
    fontSize: 14, 
    color: '#666', 
    fontStyle: 'italic' 
  },
});