import { useState } from 'react';
import Header from './components/Header';
import SaveFace from './components/SaveFace';
import RecognizeFace from './components/RecognizeFace';
import ManageFaces from './components/ManageFaces';
import './App.css';

function App() {
  const [currentMode, setCurrentMode] = useState('save');

  const handleModeChange = (mode) => {
    setCurrentMode(mode);
  };

  const renderMode = () => {
    switch (currentMode) {
      case 'save':
        return <SaveFace />;
      case 'recognize':
        return <RecognizeFace />;
      case 'manage':
        return <ManageFaces />;
      default:
        return <SaveFace />;
    }
  };

  return (
    <div className="app">
      <Header currentMode={currentMode} onModeChange={handleModeChange} />
      <main className="app-main">
        {renderMode()}
      </main>
      <footer className="app-footer">
        <p>Phase 1: Camera Integration & Basic UI ✅</p>
        <p>Phase 2: Face Detection with face-api.js ✅</p>
        <p>Phase 3: Save Face Functionality + LocalStorage ✅</p>
        <p>Phase 4: Recognition Functionality + Face Matching ✅</p>
        <p className="footer-note">
          All phases complete! Face recognition system fully operational.
        </p>
      </footer>
    </div>
  );
}

export default App;
