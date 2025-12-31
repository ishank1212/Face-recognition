import { useState, useRef } from 'react';
import Camera from './Camera';
import { useFaceDetection } from '../hooks/useFaceDetection';
import './RecognizeFace.css';

const RecognizeFace = () => {
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const {
    modelsLoaded,
    isDetecting,
    detections,
    error: detectionError,
    startDetection,
    stopDetection
  } = useFaceDetection();

  const handleCameraReady = (video, canvas) => {
    setCameraReady(true);
    videoRef.current = video;
    canvasRef.current = canvas;

    // Start face detection automatically when camera is ready
    if (modelsLoaded) {
      startDetection(video, canvas);
    }
  };

  const handleStartCamera = () => {
    setCameraActive(true);
  };

  const handleStopCamera = () => {
    setCameraActive(false);
    setCameraReady(false);
    stopDetection(canvasRef.current);
  };

  const getFaceCount = () => {
    return detections ? detections.length : 0;
  };

  return (
    <div className="recognize-face-container">
      <div className="mode-info">
        <h2>Recognize Mode</h2>
        <p>Activate the camera to recognize saved faces.</p>

        {!modelsLoaded && (
          <div className="loading-models">
            <p>Loading face detection models...</p>
          </div>
        )}

        {detectionError && (
          <div className="detection-error">
            <p>{detectionError}</p>
          </div>
        )}
      </div>

      {!cameraActive ? (
        <div className="camera-controls">
          <button
            className="btn btn-primary"
            onClick={handleStartCamera}
            disabled={!modelsLoaded}
          >
            {modelsLoaded ? 'Start Camera' : 'Loading Models...'}
          </button>
        </div>
      ) : (
        <>
          <Camera isActive={cameraActive} onCameraReady={handleCameraReady} />

          <div className="camera-controls">
            <button className="btn btn-secondary" onClick={handleStopCamera}>
              Stop Camera
            </button>
          </div>

          {cameraReady && (
            <div className="recognition-info">
              <div className="detection-status">
                {isDetecting ? (
                  <>
                    <div className="status-indicator active"></div>
                    <span>Detection Active</span>
                  </>
                ) : (
                  <>
                    <div className="status-indicator"></div>
                    <span>Detection Stopped</span>
                  </>
                )}
              </div>

              <div className="face-count">
                <strong>Faces Detected:</strong> {getFaceCount()}
              </div>

              {getFaceCount() > 0 && (
                <div className="detection-active">
                  <p className="info">✓ Detecting faces in real-time</p>
                  <p className="note">Recognition matching will be added in Phase 4</p>
                </div>
              )}

              {getFaceCount() === 0 && (
                <p className="instruction">No faces detected in frame</p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RecognizeFace;
