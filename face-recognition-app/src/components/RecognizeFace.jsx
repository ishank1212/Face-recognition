import { useState } from 'react';
import Camera from './Camera';
import './RecognizeFace.css';

const RecognizeFace = () => {
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);

  const handleCameraReady = (video, canvas) => {
    setCameraReady(true);
    console.log('Camera ready for face recognition');
  };

  const handleStartCamera = () => {
    setCameraActive(true);
  };

  const handleStopCamera = () => {
    setCameraActive(false);
    setCameraReady(false);
  };

  return (
    <div className="recognize-face-container">
      <div className="mode-info">
        <h2>Recognize Mode</h2>
        <p>Activate the camera to recognize saved faces.</p>
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
            <div className="recognition-info">
              <p>Camera is active and ready.</p>
              <p className="note">Face recognition will be enabled in Phase 4</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RecognizeFace;
