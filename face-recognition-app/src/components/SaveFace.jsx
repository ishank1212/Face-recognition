import { useState, useRef } from 'react';
import Camera from './Camera';
import { useFaceDetection } from '../hooks/useFaceDetection';
import './SaveFace.css';

const SaveFace = () => {
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
    <div className="save-face-container">
      <div className="mode-info">
        <h2>Save Face Mode</h2>
        <p>Activate the camera to detect and save a new face.</p>

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
            <div className="detection-info">
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

              {getFaceCount() === 0 && (
                <p className="instruction">Position your face in the camera frame</p>
              )}

              {getFaceCount() === 1 && (
                <div className="face-detected">
                  <p className="success">✓ Face detected successfully!</p>
                  <p className="note">Capture functionality will be added in Phase 3</p>
                </div>
              )}

              {getFaceCount() > 1 && (
                <p className="warning">Multiple faces detected. Please ensure only one person is visible.</p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SaveFace;
