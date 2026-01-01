import { useState, useEffect } from 'react';
import { getSavedFaces, deleteFace, clearAllFaces, getStorageSize } from '../utils/storage';
import './ManageFaces.css';

const ManageFaces = () => {
  const [faces, setFaces] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [faceToDelete, setFaceToDelete] = useState(null);
  const [showClearAllModal, setShowClearAllModal] = useState(false);

  // Load faces on mount and set up refresh
  useEffect(() => {
    loadFaces();
  }, []);

  const loadFaces = () => {
    const savedFaces = getSavedFaces();
    setFaces(savedFaces);
  };

  const handleDeleteClick = (face) => {
    setFaceToDelete(face);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (faceToDelete) {
      const success = deleteFace(faceToDelete.id);
      if (success) {
        loadFaces();
        setShowDeleteModal(false);
        setFaceToDelete(null);
      }
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setFaceToDelete(null);
  };

  const handleClearAllClick = () => {
    setShowClearAllModal(true);
  };

  const handleConfirmClearAll = () => {
    const success = clearAllFaces();
    if (success) {
      loadFaces();
      setShowClearAllModal(false);
    }
  };

  const handleCancelClearAll = () => {
    setShowClearAllModal(false);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="manage-faces-container">
      <div className="mode-info">
        <h2>Manage Faces</h2>
        <p>View and manage all saved faces.</p>

        {faces.length > 0 && (
          <div className="storage-info">
            <p>
              <strong>{faces.length}</strong> face{faces.length !== 1 ? 's' : ''} saved
              {' • '}
              Storage: <strong>{getStorageSize()} KB</strong>
            </p>
          </div>
        )}
      </div>

      {faces.length === 0 ? (
        <div className="faces-list">
          <div className="empty-state">
            <svg
              className="empty-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h3>No Faces Saved Yet</h3>
            <p>Use "Save Face" mode to add faces to your collection.</p>
          </div>
        </div>
      ) : (
        <>
          <div className="faces-grid">
            {faces.map((face) => (
              <div key={face.id} className="face-card">
                <div className="face-card-header">
                  <div className="face-avatar">
                    <svg
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteClick(face)}
                    title="Delete face"
                  >
                    <svg
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
                <div className="face-card-body">
                  <h3 className="face-name">{face.name}</h3>
                  <p className="face-date">Saved: {formatDate(face.timestamp)}</p>
                  <p className="face-descriptor">
                    128-dimension descriptor
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="manage-actions">
            <button
              className="btn btn-danger"
              onClick={handleClearAllClick}
            >
              Clear All Faces
            </button>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && faceToDelete && (
        <div className="modal-overlay" onClick={handleCancelDelete}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Face</h3>
            <p>Are you sure you want to delete <strong>{faceToDelete.name}</strong>?</p>
            <p className="warning-text">This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={handleCancelDelete}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleConfirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear All Confirmation Modal */}
      {showClearAllModal && (
        <div className="modal-overlay" onClick={handleCancelClearAll}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Clear All Faces</h3>
            <p>Are you sure you want to delete all <strong>{faces.length}</strong> saved faces?</p>
            <p className="warning-text">This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={handleCancelClearAll}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleConfirmClearAll}>
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageFaces;
