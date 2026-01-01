import './Header.css';

const Header = ({ currentMode, onModeChange }) => {
  return (
    <header className="app-header">
      <h1 className="app-title">Face Recognition</h1>

      <div className="mode-selector">
        <button
          className={`mode-btn ${currentMode === 'save' ? 'active' : ''}`}
          onClick={() => onModeChange('save')}
        >
          Save Face
        </button>
        <button
          className={`mode-btn ${currentMode === 'recognize' ? 'active' : ''}`}
          onClick={() => onModeChange('recognize')}
        >
          Recognize
        </button>
        <button
          className={`mode-btn ${currentMode === 'manage' ? 'active' : ''}`}
          onClick={() => onModeChange('manage')}
        >
          Manage
        </button>
      </div>
    </header>
  );
};

export default Header;
