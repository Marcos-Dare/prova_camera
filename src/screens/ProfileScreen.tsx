import { InMemoryProfileRepository } from '../repositories/InMemoryProfileRepository'; 
const profileRepository = InMemoryProfileRepository.getInstance();

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
import * as ImagePicker from 'expo-image-picker';



// import { DrawerProps } from '../navigation/types';
//import { StackProps } from '../navigation/types';
 import { TabProps } from '../navigation/types';

// type Props = DrawerProps<'Profile'>;
//type Props = StackProps<'Profile'>; // Estamos em "Modo Stack"
 type Props = TabProps<'Profile'>;

// MUDANÇA 2: Receber a prop 'navigation'
export default function ProfileScreen({ route, navigation }: Props) {
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

  const handlePickImage = async () => {
    // 1. Pedir permissão para acessar a galeria de mídia
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      // Se o usuário negar, mostramos um alerta
      Alert.alert('Permissão necessária', 'Precisamos da permissão da galeria para você poder escolher uma foto.');
      return; // Para a execução da função
    }

    // 2. Abrir a galeria do usuário
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Garante que vamos pegar apenas imagens
      allowsEditing: true, // Permite ao usuário recortar a imagem
      aspect: [1, 1],      // Força um recorte quadrado (ótimo para fotos de perfil)
      quality: 0.5,        // Comprime a imagem, assim como fazemos na câmera
    });

    // 3. Lidar com o resultado da seleção
    if (!result.canceled) {
      // 'result.canceled' é true se o usuário fechar a galeria sem escolher
      
      // Se ele ESCOLHEU uma imagem, ela vem em 'result.assets'
      const newUri = result.assets[0].uri;
      
      // AGORA A MÁGICA:
      // Vamos recarregar esta tela, passando a URI da galeria
      // exatamente como se ela tivesse vindo da câmera.
      navigation.navigate('Profile', { photoUri: newUri });
    }
  };

  const showSaveButton = isNewPhotoUnsaved && currentDisplayPhotoUri === newPhotoUriFromCamera;
  const showDeleteButton = currentDisplayPhotoUri && !isNewPhotoUnsaved && savedPhotos.includes(currentDisplayPhotoUri);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minha Foto</Text>
      <View style={styles.quadrin}>
        {currentDisplayPhotoUri ? (
          <Image source={{ uri: currentDisplayPhotoUri }} style={styles.mainImage} />
        ) : (
          <View style={styles.mainImagePlaceholder}>
            <Text style={styles.noPhotoText}>Tire uma foto na Câmera</Text>
          </View>
        )}
      </View>

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

      {/* MUDANÇA 3: O botão que usa 'navigation' */}
      <View style={styles.navButtonContainer}>
        <Button
          title="Tirar Nova Foto"
          onPress={() => navigation.navigate('Camera')}
        />

        <View style={{ marginVertical: 5 }} /> 
        <Button
          title="Escolher da Galeria"
          onPress={handlePickImage}
          color="#841584"
        />
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
  // MUDANÇA 4: O estilo para o botão
  navButtonContainer: {
    width: '80%',
    marginVertical: 5,
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
  quadrin: {
    backgroundColor: 'orange',
    width: 320,
    height: 320,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    marginBottom: 10,
  }
});
