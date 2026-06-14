const STORAGE_KEY = 'amorae_prefs';

/**
 * Salva preferências do usuário no Local Storage.
 * @param {Object} prefs - objeto com preferências
 */
export function savePreferences(prefs) {
  try {
    const current = loadPreferences();
    const updated = { ...current, ...prefs };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Erro ao salvar preferências:', error);
  }
}

/**
 * Carrega e aplica preferências salvas do Local Storage.
 * @returns {Object} preferências salvas
 */
export function loadPreferences() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const prefs = raw ? JSON.parse(raw) : {};

    // Aplica preferências ao DOM se existirem
    if (prefs.lastCategory) {
      document.dispatchEvent(
        new CustomEvent('restoreCategory', { detail: { category: prefs.lastCategory } })
      );
    }

    return prefs;
  } catch (error) {
    console.error('Erro ao carregar preferências:', error);
    return {};
  }
}

/**
 * Salva a última categoria visitada na galeria.
 * @param {string} category - nome da categoria
 */
export function saveLastCategory(category) {
  savePreferences({ lastCategory: category });
}

/**
 * 
 */
export function clearPreferences() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Erro ao limpar preferências:', error);
  }
}
