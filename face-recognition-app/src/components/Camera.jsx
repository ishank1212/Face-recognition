import { useEffect, useRef, useState } from 'react';
import './Camera.css';

const Camera = ({ isActive, onCameraReady }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isActive) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isActive]);

  const startCamera = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        },
        audio: false
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          setIsLoading(false);
          if (onCameraReady) {
            onCameraReady(videoRef.current, canvasRef.current);
          }
        };
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError(
        err.name === 'NotAllowedError'
          ? 'Camera access denied. Please allow camera permissions.'
          : 'Error accessing camera. Please ensure you have a camera connected.'
      );
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  return (
    <div className="camera-container">
      {error && (
        <div className="camera-error">
          <p>{error}</p>
        </div>
      )}

      {isLoading && (
        <div className="camera-loading">
          <p>Starting camera...</p>
        </div>
      )}

      <div className="video-wrapper">
        <video
          ref={videoRef}
          className="camera-video"
          playsInline
          muted
        />
        <canvas
          ref={canvasRef}
          className="camera-canvas"
        />
      </div>
    </div>
  );
};

export default Camera;
