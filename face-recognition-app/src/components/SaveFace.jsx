import { useState } from 'react';
import Camera from './Camera';
import './SaveFace.css';

const SaveFace = () => {
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);

  const handleCameraReady = (video, canvas) => {
    setCameraReady(true);
    console.log('Camera ready for face detection');
  };

  const handleStartCamera = () => {
    setCameraActive(true);
  };

  const handleStopCamera = () => {
    setCameraActive(false);
    setCameraReady(false);
  };

  return (
    <div className="save-face-container">
      <div className="mode-info">
        <h2>Save Face Mode</h2>
        <p>Activate the camera to detect and save a new face.</p>
      </div>

      {!cameraActive ? (
        <div className="camera-controls">
          <button className="btn btn-primary" onClick={handleStartCamera}>
            Start Camera
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
            <div className="save-instructions">
              <p>Position your face in the camera and wait for detection.</p>
              <p className="note">Face detection will be enabled in Phase 2</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SaveFace;
