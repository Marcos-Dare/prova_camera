// src/repositories/IProfileRepository.ts

export interface IProfileRepository {
  /**
   * Adiciona uma nova URI de foto à lista de fotos salvas.
   * @param uri A string da URI da foto a ser salva.
   */
  addPhoto: (uri: string) => Promise<void>;

  /**
   * Carrega todas as URIs de fotos salvas.
   * @returns Um array de URIs de fotos. Pode ser vazio se não houver fotos.
   */
  loadAllPhotos: () => Promise<string[]>;

  /**
   * Define uma URI de foto como a "atual" ou "principal".
   * @param uri A URI da foto a ser definida como principal.
   */
  setCurrentPhoto: (uri: string) => Promise<void>;

  /**
   * Carrega a URI da foto atualmente definida como "principal".
   * @returns A URI da foto principal ou null se nenhuma for definida.
   */
  loadCurrentPhoto: () => Promise<string | null>;

  /**
   * Remove uma URI de foto da lista.
   * @param uri A URI da foto a ser removida.
   */
  removePhoto: (uri: string) => Promise<void>;
}