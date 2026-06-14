const DATA_URL = 'scripts/photos.json';

/**
 * @returns {Promise<Array>} array de objetos de foto
 */
export async function fetchPhotos() {
  try {
    const response = await fetch(DATA_URL);

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data.photos;

  } catch (error) {
    console.error('fetchPhotos falhou:', error);
    throw error;
  }
}
