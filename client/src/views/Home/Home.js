import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import bgImage from '../../assets/images/gba_bg.png';
import { AudioContext } from '../../App';

const nicknames = [
  "Geometric Guardian", "PolyProtector", "Shape Sentinel", "Triumphant Triangle", 
  "Polygon Paladin", "Geometric Gladiator", "Shape Slayer", "Geometric Knight", 
  "Polygon Warrior", "Geometric Nemesis", "Polygon Master", "Adversary Architect", 
  "Shape Shadower", "Polygon Persecutor", "Geometric Challenger", "Shape Sorcerer", 
  "Adversary Overlord", "Polygon Conjurer"
];

function Home() {
  const navigate = useNavigate();
  const { isPlaying, toggleAudio, speakerIcon, speakerOffIcon } = useContext(AudioContext);

  const generateRoomCode = () => {
    return Math.random().toString(36).substr(2, 5).toUpperCase();
  };

  const getNickname = () => {
    const nicknameInput = document.getElementById("nickname").value;
    if (nicknameInput.trim() === "") {
      const randomIndex = Math.floor(Math.random() * nicknames.length);
      return nicknames[randomIndex];
    }
    return nicknameInput.trim();
  };

  const handleCreateRoom = () => {
    const code = generateRoomCode();
    const nickname = getNickname();
    localStorage.setItem("nickname", nickname);
    navigate(`/menu?roomCode=${code}`);
  };

  const handleJoinRoom = () => {
    const code = document.getElementById("enter-code").value;
    const nickname = getNickname();
    localStorage.setItem("nickname", nickname);
    navigate(`/menu?roomCode=${code}`);
  };

  const handleInputChange = (e) => {
    const input = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 5);
    e.target.value = input;
  };

  return (
    <div className="home-container">
      <div className="controls-container">
        <button onClick={toggleAudio}>
          <img src={isPlaying ? speakerIcon : speakerOffIcon} alt="Toggle Audio" />
        </button>
      </div>
      <img src={bgImage} alt="Game Background" className="bg-image" />
      <div id="ui-elements">
        <div className="row">
          <input className="ui-editbox" id="nickname" placeholder="Nickname" />
          <button className="ui-button" id="create-room" onClick={handleCreateRoom}>Create Room</button>
        </div>
        <div className="row">
          <input className="ui-editbox" id="enter-code" placeholder="Enter Code" onChange={handleInputChange} />
          <button className="ui-button" id="join-room" onClick={handleJoinRoom}>Join Room</button>
        </div>
      </div>
    </div>
  );
}

export default Home;
