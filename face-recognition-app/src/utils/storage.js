/**
 * LocalStorage utility for managing saved face data
 * Each face is stored with: id, name, descriptor, timestamp
 */

const STORAGE_KEY = 'face_recognition_data';

/**
 * Get all saved faces from LocalStorage
 * @returns {Array} Array of saved face objects
 */
export const getSavedFaces = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
};

/**
 * Save a new face to LocalStorage
 * @param {string} name - Person's name
 * @param {Float32Array} descriptor - Face descriptor (128-dimension array)
 * @returns {Object} Saved face object with id
 */
export const saveFace = (name, descriptor) => {
  try {
    const faces = getSavedFaces();

    // Create new face object
    const newFace = {
      id: generateId(),
      name: name.trim(),
      descriptor: Array.from(descriptor), // Convert Float32Array to regular array for JSON
      timestamp: new Date().toISOString()
    };

    // Add to faces array
    faces.push(newFace);

    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(faces));

    return newFace;
  } catch (error) {
    console.error('Error saving face:', error);
    throw new Error('Failed to save face data');
  }
};

/**
 * Delete a face by ID
 * @param {string} faceId - ID of face to delete
 * @returns {boolean} Success status
 */
export const deleteFace = (faceId) => {
  try {
    const faces = getSavedFaces();
    const filteredFaces = faces.filter(face => face.id !== faceId);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredFaces));
    return true;
  } catch (error) {
    console.error('Error deleting face:', error);
    return false;
  }
};

/**
 * Update a face's name
 * @param {string} faceId - ID of face to update
 * @param {string} newName - New name
 * @returns {boolean} Success status
 */
export const updateFaceName = (faceId, newName) => {
  try {
    const faces = getSavedFaces();
    const faceIndex = faces.findIndex(face => face.id === faceId);

    if (faceIndex === -1) {
      return false;
    }

    faces[faceIndex].name = newName.trim();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(faces));
    return true;
  } catch (error) {
    console.error('Error updating face:', error);
    return false;
  }
};

/**
 * Clear all saved faces
 * @returns {boolean} Success status
 */
export const clearAllFaces = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing faces:', error);
    return false;
  }
};

/**
 * Get face count
 * @returns {number} Number of saved faces
 */
export const getFaceCount = () => {
  return getSavedFaces().length;
};

/**
 * Check if a name already exists
 * @param {string} name - Name to check
 * @returns {boolean} True if name exists
 */
export const nameExists = (name) => {
  const faces = getSavedFaces();
  return faces.some(face => face.name.toLowerCase() === name.toLowerCase());
};

/**
 * Generate unique ID
 * @returns {string} Unique ID
 */
const generateId = () => {
  return `face_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Get storage size in KB
 * @returns {number} Storage size in KB
 */
export const getStorageSize = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? (new Blob([data]).size / 1024).toFixed(2) : 0;
  } catch (error) {
    return 0;
  }
};
