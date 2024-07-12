import React, { useRef, useState, createContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './views/Home/Home';
import Menu from './views/Menu/Menu';
import Game from './views/Game/Game';

import speakerIcon from './assets/icons/speaker.svg';
import speakerOffIcon from './assets/icons/speaker-off.svg';
import mainMenuMusic from './assets/audio/music/Main Menu.wav';

export const AudioContext = createContext();

function App() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const startAudio = () => {
    if (audioRef.current && !isPlaying) {
      audioRef.current.play().catch(error => console.log('Audio play error:', error));
      setIsPlaying(true);
    }
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => console.log('Audio play error:', error));
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <AudioContext.Provider value={{ isPlaying, toggleAudio, startAudio, speakerIcon, speakerOffIcon }}>
      <audio ref={audioRef} src={mainMenuMusic} loop />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/game" element={<Game />} />
        </Routes>
      </Router>
    </AudioContext.Provider>
  );
}

export default App;
