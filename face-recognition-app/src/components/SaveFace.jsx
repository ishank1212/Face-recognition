import { useState, useRef } from 'react';
import Camera from './Camera';
import { useFaceDetection } from '../hooks/useFaceDetection';
import { saveFace, nameExists } from '../utils/storage';
import './SaveFace.css';

const SaveFace = () => {
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [personName, setPersonName] = useState('');
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const capturedDescriptorRef = useRef(null);

  const {
    modelsLoaded,
    isDetecting,
    detections,
    error: detectionError,
    startDetection,
    stopDetection,
    detectSingleFace
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
    setSaveError(null);
    setSaveSuccess(null);
  };

  const handleStopCamera = () => {
    setCameraActive(false);
    setCameraReady(false);
    stopDetection(canvasRef.current);
    setSaveError(null);
    setSaveSuccess(null);
  };

  const handleCaptureFace = async () => {
    try {
      setSaveError(null);
      setIsSaving(true);

      // Get single face detection
      const detection = await detectSingleFace(videoRef.current);

      if (!detection) {
        setSaveError('No face detected. Please position your face in the frame.');
        setIsSaving(false);
        return;
      }

      // Store the descriptor
      capturedDescriptorRef.current = detection.descriptor;

      // Show name input modal
      setShowNameModal(true);
      setIsSaving(false);
    } catch (error) {
      console.error('Error capturing face:', error);
      setSaveError('Failed to capture face. Please try again.');
      setIsSaving(false);
    }
  };

  const handleSaveFace = () => {
    try {
      // Validate name
      if (!personName.trim()) {
        setSaveError('Please enter a name');
        return;
      }

      // Check if name already exists
      if (nameExists(personName)) {
        setSaveError('This name already exists. Please use a different name.');
        return;
      }

      // Save to localStorage
      saveFace(personName, capturedDescriptorRef.current);

      // Show success message
      setSaveSuccess(`Successfully saved face for "${personName}"!`);

      // Reset state
      setShowNameModal(false);
      setPersonName('');
      capturedDescriptorRef.current = null;

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(null);
      }, 3000);
    } catch (error) {
      console.error('Error saving face:', error);
      setSaveError('Failed to save face data. Please try again.');
    }
  };

  const handleCancelSave = () => {
    setShowNameModal(false);
    setPersonName('');
    setSaveError(null);
    capturedDescriptorRef.current = null;
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

        {saveSuccess && (
          <div className="save-success">
            <p>{saveSuccess}</p>
          </div>
        )}

        {saveError && (
          <div className="save-error">
            <p>{saveError}</p>
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
                  <button
                    className="btn btn-capture"
                    onClick={handleCaptureFace}
                    disabled={isSaving}
                  >
                    {isSaving ? 'Capturing...' : 'Capture Face'}
                  </button>
                </div>
              )}

              {getFaceCount() > 1 && (
                <p className="warning">Multiple faces detected. Please ensure only one person is visible.</p>
              )}
            </div>
          )}
        </>
      )}

      {/* Name Input Modal */}
      {showNameModal && (
        <div className="modal-overlay" onClick={handleCancelSave}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Save Face</h3>
            <p>Enter the person's name:</p>
            <input
              type="text"
              className="name-input"
              placeholder="Enter name"
              value={personName}
              onChange={(e) => setPersonName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSaveFace()}
              autoFocus
            />
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={handleCancelSave}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSaveFace}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SaveFace;
