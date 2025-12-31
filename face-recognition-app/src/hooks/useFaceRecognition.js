import { useState, useEffect, useRef, useCallback } from 'react';
import { loadModels, detectFaces, drawDetections, clearCanvas } from '../utils/faceapi';
import { matchMultipleFaces } from '../utils/faceMatching';

/**
 * Custom hook for face recognition (detection + matching)
 * Handles model loading, face detection, matching against saved faces, and canvas drawing
 */
export const useFaceRecognition = (threshold = 0.6) => {
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [recognitionResults, setRecognitionResults] = useState([]);
  const [error, setError] = useState(null);
  const recognitionIntervalRef = useRef(null);

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
   * Start continuous face recognition
   */
  const startRecognition = useCallback((videoElement, canvasElement) => {
    if (!modelsLoaded) {
      setError('Models not loaded yet');
      return;
    }

    if (!videoElement || !canvasElement) {
      setError('Video or canvas element not available');
      return;
    }

    setIsRecognizing(true);
    setError(null);

    // Recognition loop - runs every 100ms
    recognitionIntervalRef.current = setInterval(async () => {
      try {
        // Detect faces
        const faceDetections = await detectFaces(videoElement);

        // Match detected faces against saved faces
        const matches = matchMultipleFaces(faceDetections, threshold);
        setRecognitionResults(matches);

        // Draw detections on canvas
        if (faceDetections && faceDetections.length > 0) {
          drawDetections(canvasElement, faceDetections, videoElement);
        } else {
          clearCanvas(canvasElement);
        }
      } catch (err) {
        console.error('Recognition error:', err);
      }
    }, 100);
  }, [modelsLoaded, threshold]);

  /**
   * Stop face recognition
   */
  const stopRecognition = useCallback((canvasElement) => {
    if (recognitionIntervalRef.current) {
      clearInterval(recognitionIntervalRef.current);
      recognitionIntervalRef.current = null;
    }

    setIsRecognizing(false);
    setRecognitionResults([]);

    if (canvasElement) {
      clearCanvas(canvasElement);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionIntervalRef.current) {
        clearInterval(recognitionIntervalRef.current);
      }
    };
  }, []);

  return {
    modelsLoaded,
    isRecognizing,
    recognitionResults,
    error,
    startRecognition,
    stopRecognition
  };
};
