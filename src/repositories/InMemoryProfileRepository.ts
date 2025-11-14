// src/repositories/InMemoryProfileRepository.ts

import { IProfileRepository } from './IProfileRepository';

export class InMemoryProfileRepository implements IProfileRepository {
  
  // Lista de todas as fotos salvas
  private inMemoryPhotos: string[] = [];
  // A foto atualmente selecionada/principal
  private currentPhotoUri: string | null = null;
  
  private static instance: InMemoryProfileRepository | null = null;

  public static getInstance(): InMemoryProfileRepository {
    if (!InMemoryProfileRepository.instance) {
      InMemoryProfileRepository.instance = new InMemoryProfileRepository();
    }
    return InMemoryProfileRepository.instance;
  }

  async addPhoto(uri: string): Promise<void> {
    console.log('[REPO-MEM] Adicionando URI:', uri);
    // Evitar duplicatas (opcional, mas boa prática)
    if (!this.inMemoryPhotos.includes(uri)) {
      this.inMemoryPhotos.push(uri);
    }
  }

  async loadAllPhotos(): Promise<string[]> {
    console.log('[REPO-MEM] Carregando todas as URIs:', this.inMemoryPhotos);
    return [...this.inMemoryPhotos]; // Retorna uma cópia para evitar modificações externas
  }

  async setCurrentPhoto(uri: string): Promise<void> {
    console.log('[REPO-MEM] Definindo URI atual:', uri);
    this.currentPhotoUri = uri;
  }

  async loadCurrentPhoto(): Promise<string | null> {
    console.log('[REPO-MEM] Carregando URI atual:', this.currentPhotoUri);
    return this.currentPhotoUri;
  }

  async removePhoto(uri: string): Promise<void> {
    console.log('[REPO-MEM] Removendo URI:', uri);
    this.inMemoryPhotos = this.inMemoryPhotos.filter(photo => photo !== uri);
    // Se a foto removida era a atual, limpa a atual
    if (this.currentPhotoUri === uri) {
      this.currentPhotoUri = null;
    }
  }
}