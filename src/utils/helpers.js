// Normalizar string para comparação (remove acentos, lowercase, etc)
export const normalizeString = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9\s]/g, '') // Remove caracteres especiais
    .trim();
};

// Verificar se duas strings são similares (fuzzy matching)
export const isCloseMatch = (guess, target) => {
  const normalizedGuess = normalizeString(guess);
  const normalizedTarget = normalizeString(target);
  
  // Match exato
  if (normalizedGuess === normalizedTarget) return true;
  
  // Match parcial (contém a palavra)
  if (normalizedTarget.includes(normalizedGuess) || normalizedGuess.includes(normalizedTarget)) {
    return true;
  }
  
  // Levenshtein distance simples (para erros de digitação)
  const distance = levenshteinDistance(normalizedGuess, normalizedTarget);
  const maxLength = Math.max(normalizedGuess.length, normalizedTarget.length);
  const similarity = 1 - (distance / maxLength);
  
  // Considera "quase lá" se similaridade > 70%
  return similarity > 0.7;
};

// Distância de Levenshtein (edit distance)
const levenshteinDistance = (str1, str2) => {
  const matrix = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
};

// Gerar código de sala
export const generateRoomCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

