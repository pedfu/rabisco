// Funções utilitárias para localStorage

export const saveEmailToLocalStorage = (email) => {
  try {
    localStorage.setItem('savedEmail', email);
  } catch (error) {
    console.error('Erro ao salvar email:', error);
  }
};

export const getSavedEmail = () => {
  try {
    return localStorage.getItem('savedEmail') || null;
  } catch (error) {
    console.error('Erro ao recuperar email:', error);
    return null;
  }
};

export const clearSavedEmail = () => {
  try {
    localStorage.removeItem('savedEmail');
  } catch (error) {
    console.error('Erro ao limpar email:', error);
  }
};

