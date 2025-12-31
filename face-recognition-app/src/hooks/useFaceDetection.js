import { useState, useEffect, useRef, useCallback } from 'react';
import { loadModels, detectFaces, drawDetections, clearCanvas } from '../utils/faceapi';

/**
 * Custom hook for face detection
 * Handles model loading, face detection loop, and canvas drawing
 */
export const useFaceDetection = () => {
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detections, setDetections] = useState([]);
  const [error, setError] = useState(null);
  const detectionIntervalRef = useRef(null);

  // Load models on mount
  useEffect(() => {
    const initModels = async () => {
      try {
        const loaded = await loadModels();
        setModelsLoaded(loaded);
        if (!loaded) {
          setError('Failed to load face detection models');
        }
      } catch (err) {
        console.error('Error loading models:', err);
        setError('Error loading face detection models');
      }
    };

    initModels();
  }, []);

  /**
   * Start continuous face detection
   */
  const startDetection = useCallback((videoElement, canvasElement) => {
    if (!modelsLoaded) {
      setError('Models not loaded yet');
      return;
    }

    if (!videoElement || !canvasElement) {
      setError('Video or canvas element not available');
      return;
    }

    setIsDetecting(true);
    setError(null);

    // Detection loop - runs every 100ms
    detectionIntervalRef.current = setInterval(async () => {
      try {
        const faceDetections = await detectFaces(videoElement);
        setDetections(faceDetections);

        // Draw detections on canvas
        if (faceDetections && faceDetections.length > 0) {
          drawDetections(canvasElement, faceDetections, videoElement);
        } else {
          clearCanvas(canvasElement);
        }
      } catch (err) {
        console.error('Detection error:', err);
      }
    }, 100);
  }, [modelsLoaded]);

  /**
   * Stop face detection
   */
  const stopDetection = useCallback((canvasElement) => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }

    setIsDetecting(false);
    setDetections([]);

    if (canvasElement) {
      clearCanvas(canvasElement);
    }
  }, []);

  /**
   * Get single face detection (for capturing)
   */
  const detectSingleFace = useCallback(async (videoElement) => {
    if (!modelsLoaded) {
      throw new Error('Models not loaded yet');
    }

    const faceDetections = await detectFaces(videoElement);
    return faceDetections.length > 0 ? faceDetections[0] : null;
  }, [modelsLoaded]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
  }, []);

  return {
    modelsLoaded,
    isDetecting,
    detections,
    error,
    startDetection,
    stopDetection,
    detectSingleFace
  };
};
