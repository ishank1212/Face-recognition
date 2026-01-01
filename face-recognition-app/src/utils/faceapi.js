import * as faceapi from 'face-api.js';

let modelsLoaded = false;

/**
 * Load face-api.js models required for face detection and recognition
 * Models: SSD MobileNet (detection), Face Landmark (68 points), Face Recognition
 */
export const loadModels = async () => {
  if (modelsLoaded) {
    return true;
  }

  try {
    const MODEL_URL = '/models';

    // Load models in parallel for better performance
    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
    ]);

    modelsLoaded = true;
    console.log('Face-api.js models loaded successfully');
    return true;
  } catch (error) {
    console.error('Error loading face-api.js models:', error);
    return false;
  }
};

/**
 * Check if models are loaded
 */
export const areModelsLoaded = () => {
  return modelsLoaded;
};

/**
 * Detect faces in video element
 * @param {HTMLVideoElement} videoElement - Video element to detect faces from
 * @returns {Promise<Array>} Array of face detections with landmarks and descriptors
 */
export const detectFaces = async (videoElement) => {
  if (!modelsLoaded) {
    throw new Error('Models not loaded. Call loadModels() first.');
  }

  try {
    const detections = await faceapi
      .detectAllFaces(videoElement, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 }))
      .withFaceLandmarks()
      .withFaceDescriptors();

    return detections;
  } catch (error) {
    console.error('Error detecting faces:', error);
    return [];
  }
};

/**
 * Draw face detections on canvas
 * @param {HTMLCanvasElement} canvas - Canvas element to draw on
 * @param {Array} detections - Array of face detections
 * @param {HTMLVideoElement} videoElement - Video element for dimensions
 */
export const drawDetections = (canvas, detections, videoElement) => {
  if (!canvas || !detections || detections.length === 0) {
    return;
  }

  const displaySize = {
    width: videoElement.videoWidth,
    height: videoElement.videoHeight
  };

  faceapi.matchDimensions(canvas, displaySize);

  const resizedDetections = faceapi.resizeResults(detections, displaySize);

  // Clear previous drawings
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw face detection boxes
  faceapi.draw.drawDetections(canvas, resizedDetections);

  // Draw face landmarks
  faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
};

/**
 * Clear canvas
 * @param {HTMLCanvasElement} canvas - Canvas element to clear
 */
export const clearCanvas = (canvas) => {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};
