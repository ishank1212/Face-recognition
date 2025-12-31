import { useState, useRef } from 'react';
import Camera from './Camera';
import { useFaceRecognition } from '../hooks/useFaceRecognition';
import { getSavedFaces } from '../utils/storage';
import { formatConfidence, getConfidenceLevel } from '../utils/faceMatching';
import './RecognizeFace.css';

const RecognizeFace = () => {
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [threshold, setThreshold] = useState(0.6);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const {
    modelsLoaded,
    isRecognizing,
    recognitionResults,
    error: recognitionError,
    startRecognition,
    stopRecognition
  } = useFaceRecognition(threshold);

  const savedFacesCount = getSavedFaces().length;

  const handleCameraReady = (video, canvas) => {
    setCameraReady(true);
    videoRef.current = video;
    canvasRef.current = canvas;

    // Start face recognition automatically when camera is ready
    if (modelsLoaded) {
      startRecognition(video, canvas);
    }
  };

  const handleStartCamera = () => {
    setCameraActive(true);
  };

  const handleStopCamera = () => {
    setCameraActive(false);
    setCameraReady(false);
    stopRecognition(canvasRef.current);
  };

  const handleThresholdChange = (e) => {
    setThreshold(parseFloat(e.target.value));
  };

  const getThresholdLabel = () => {
    if (threshold <= 0.5) return 'Strict';
    if (threshold <= 0.6) return 'Balanced';
    return 'Permissive';
  };

  return (
    <div className="recognize-face-container">
      <div className="mode-info">
        <h2>Recognize Mode</h2>
        <p>Activate the camera to recognize saved faces.</p>

        {savedFacesCount === 0 && (
          <div className="no-faces-warning">
            <p>⚠️ No faces saved yet. Use "Save Face" mode to add faces first.</p>
          </div>
        )}

        {!modelsLoaded && (
          <div className="loading-models">
            <p>Loading face detection models...</p>
          </div>
        )}

        {recognitionError && (
          <div className="detection-error">
            <p>{recognitionError}</p>
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
            {modelsLoaded ? 'Start Recognition' : 'Loading Models...'}
          </button>

          {savedFacesCount > 0 && (
            <div className="settings-info">
              <p>Ready to recognize {savedFacesCount} saved face{savedFacesCount !== 1 ? 's' : ''}</p>
            </div>
          )}
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
            <>
              <div className="recognition-settings">
                <div className="threshold-control">
                  <label>
                    Recognition Sensitivity: <strong>{getThresholdLabel()}</strong>
                  </label>
                  <input
                    type="range"
                    min="0.4"
                    max="0.8"
                    step="0.05"
                    value={threshold}
                    onChange={handleThresholdChange}
                    className="threshold-slider"
                  />
                  <div className="threshold-labels">
                    <span>Strict</span>
                    <span>Balanced</span>
                    <span>Permissive</span>
                  </div>
                </div>
              </div>

              <div className="recognition-info">
                <div className="detection-status">
                  {isRecognizing ? (
                    <>
                      <div className="status-indicator active"></div>
                      <span>Recognition Active</span>
                    </>
                  ) : (
                    <>
                      <div className="status-indicator"></div>
                      <span>Recognition Stopped</span>
                    </>
                  )}
                </div>

                <div className="face-count">
                  <strong>Faces Detected:</strong> {recognitionResults.length}
                </div>

                {recognitionResults.length === 0 && (
                  <p className="instruction">No faces detected in frame</p>
                )}

                {recognitionResults.length > 0 && (
                  <div className="recognition-results">
                    <h3>Recognition Results:</h3>
                    {recognitionResults.map((result, index) => (
                      <div
                        key={index}
                        className={`result-card ${result.match.matched ? 'matched' : 'unknown'}`}
                      >
                        <div className="result-header">
                          <div className="result-icon">
                            {result.match.matched ? (
                              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                            ) : (
                              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                            )}
                          </div>
                          <div className="result-info">
                            <h4 className="result-name">{result.match.name}</h4>
                            <p className="result-status">
                              {result.match.matched ? 'Recognized' : 'Unknown Person'}
                            </p>
                          </div>
                        </div>

                        {result.match.matched && (
                          <div className="result-details">
                            <div className="detail-row">
                              <span className="detail-label">Confidence:</span>
                              <span className="detail-value confidence">
                                {formatConfidence(result.match.confidence)}
                                <span className="confidence-level">
                                  ({getConfidenceLevel(result.match.confidence)})
                                </span>
                              </span>
                            </div>
                            <div className="detail-row">
                              <span className="detail-label">Distance:</span>
                              <span className="detail-value">
                                {result.match.distance.toFixed(3)}
                              </span>
                            </div>
                            <div className="confidence-bar">
                              <div
                                className="confidence-fill"
                                style={{ width: `${result.match.confidence}%` }}
                              ></div>
                            </div>
                          </div>
                        )}

                        {!result.match.matched && (
                          <div className="result-details">
                            <p className="unknown-hint">
                              This face is not in your saved collection.
                              {savedFacesCount > 0 && ` (Closest match distance: ${result.match.distance.toFixed(3)})`}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default RecognizeFace;
