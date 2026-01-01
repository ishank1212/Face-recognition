import { getSavedFaces } from './storage';

/**
 * Calculate Euclidean distance between two face descriptors
 * @param {Array|Float32Array} descriptor1 - First face descriptor
 * @param {Array|Float32Array} descriptor2 - Second face descriptor
 * @returns {number} Euclidean distance
 */
export const euclideanDistance = (descriptor1, descriptor2) => {
  if (!descriptor1 || !descriptor2) {
    return Infinity;
  }

  if (descriptor1.length !== descriptor2.length) {
    console.error('Descriptor length mismatch');
    return Infinity;
  }

  let sum = 0;
  for (let i = 0; i < descriptor1.length; i++) {
    const diff = descriptor1[i] - descriptor2[i];
    sum += diff * diff;
  }

  return Math.sqrt(sum);
};

/**
 * Find the best match for a face descriptor among saved faces
 * @param {Float32Array} faceDescriptor - Face descriptor to match
 * @param {number} threshold - Maximum distance threshold (default: 0.6)
 * @returns {Object|null} Match result with name, distance, and confidence
 */
export const findBestMatch = (faceDescriptor, threshold = 0.6) => {
  const savedFaces = getSavedFaces();

  if (savedFaces.length === 0) {
    return null;
  }

  let bestMatch = null;
  let minDistance = Infinity;

  // Compare against all saved faces
  for (const savedFace of savedFaces) {
    const distance = euclideanDistance(faceDescriptor, savedFace.descriptor);

    if (distance < minDistance) {
      minDistance = distance;
      bestMatch = savedFace;
    }
  }

  // Check if best match is within threshold
  if (minDistance <= threshold) {
    // Calculate confidence score (0-100%)
    // Distance of 0 = 100% confidence, distance of threshold = 0% confidence
    const confidence = Math.max(0, Math.min(100, (1 - minDistance / threshold) * 100));

    return {
      name: bestMatch.name,
      distance: minDistance,
      confidence: confidence,
      id: bestMatch.id,
      matched: true
    };
  }

  // No match found within threshold
  return {
    name: 'Unknown',
    distance: minDistance,
    confidence: 0,
    matched: false
  };
};

/**
 * Match multiple face detections against saved faces
 * @param {Array} detections - Array of face detections with descriptors
 * @param {number} threshold - Maximum distance threshold
 * @returns {Array} Array of match results
 */
export const matchMultipleFaces = (detections, threshold = 0.6) => {
  if (!detections || detections.length === 0) {
    return [];
  }

  return detections.map(detection => {
    const match = findBestMatch(detection.descriptor, threshold);
    return {
      detection: detection,
      match: match
    };
  });
};

/**
 * Get recommended threshold based on security level
 * @param {string} securityLevel - 'low', 'medium', or 'high'
 * @returns {number} Threshold value
 */
export const getThresholdForSecurityLevel = (securityLevel) => {
  switch (securityLevel) {
    case 'low':
      return 0.7; // More permissive, more false positives
    case 'medium':
      return 0.6; // Balanced
    case 'high':
      return 0.5; // Strict, fewer false positives
    default:
      return 0.6;
  }
};

/**
 * Get confidence level label
 * @param {number} confidence - Confidence percentage (0-100)
 * @returns {string} Confidence level label
 */
export const getConfidenceLevel = (confidence) => {
  if (confidence >= 80) return 'Very High';
  if (confidence >= 60) return 'High';
  if (confidence >= 40) return 'Medium';
  if (confidence >= 20) return 'Low';
  return 'Very Low';
};

/**
 * Format confidence percentage for display
 * @param {number} confidence - Confidence value (0-100)
 * @returns {string} Formatted confidence string
 */
export const formatConfidence = (confidence) => {
  return `${confidence.toFixed(1)}%`;
};
