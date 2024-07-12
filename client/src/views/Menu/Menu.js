import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import './Menu.css';

import bgImageBlue from '../../assets/images/shape_shifter.png';
import bgImageRed from '../../assets/images/summoner.png';

const socket = io('http://localhost:3000');

let clientId = '';
let menuState = {};
let teamToColor = {
  "redBlock": "red",
  "blueBlock": "blue"
};

const Menu = () => {
  const location = useLocation();
  const navigate = useNavigate();
  let searchParams = new URLSearchParams(location.search);
  let roomCode = searchParams.get("roomCode");
  const [selectedBlock, setSelectedBlock] = useState('');
  const [userName] = useState(localStorage.getItem("nickname"));

  useEffect(() => {
    socket.emit('join room', roomCode);

    socket.on('update client id', (id) => {
      if (clientId === '') {
        clientId = id;
        console.log("updated id to " + clientId);
      }
    });

    socket.on('update mstate', (mstate) => {
      menuState = mstate;
      console.log("your id is " + clientId);
      console.log(menuState);

      updateState();

      if (Object.keys(menuState).length === 2) {
        console.log("CAN MOVE ON TO GAME");
        // navigate('/game');
      }
    });

    return () => {
      socket.off('update choices');
      socket.off('start game');
    };
  }, [navigate, roomCode]);

  const handleClick = (block) => {
    socket.emit('block selected', { roomCode, block });
    setSelectedBlock(block);
  };

  const updateState = () => {
    const colorSet = new Set();
    for (const color of Object.values(menuState)) {
      colorSet.add(teamToColor[color]);
    }

    // Check if colorSet has 'red' and change the backgroundColor accordingly
    if (colorSet.has('red')) {
      document.getElementById('redBlock').style.backgroundColor = 'red';
    } else {
      document.getElementById('redBlock').style.backgroundColor = '#bbb';
    }

    // Check if colorSet has 'blue' and change the backgroundColor accordingly
    if (colorSet.has('blue')) {
      document.getElementById('blueBlock').style.backgroundColor = 'blue';
    } else {
      document.getElementById('blueBlock').style.backgroundColor = '#bbb';
    }
  };

  const handleJoinRoom = () => {
    navigate(`/game`);
  };

  const handleCopyRoomCode = () => {
    navigator.clipboard.writeText(roomCode).then(() => {
    });
  };

  return (
    <div className="menu-container">
      <h1 style={{ color: 'white' }}>Pick your side, {userName}!</h1>

      <div className="blocks-container">
        <div className="block-container">
          <div className="block-text">Shape Shifter</div>
          <div 
            id="blueBlock" 
            className={`block ${selectedBlock === 'blueBlock' ? 'clicked' : ''}`} 
            onClick={() => handleClick('blueBlock')} 
          >
            <img src={bgImageBlue} alt="Shape Shifter" />
            {selectedBlock === 'blueBlock' && <div className="username-rectangle">{userName}</div>}
          </div>
        </div>
        <div className="block-container">
          <div className="block-text">Summoner</div>
          <div 
            id="redBlock" 
            className={`block ${selectedBlock === 'redBlock' ? 'clicked' : ''}`} 
            onClick={() => handleClick('redBlock')} 
          >
            <img src={bgImageRed} alt="Summoner" />
            {selectedBlock === 'redBlock' && <div className="username-rectangle">{userName}</div>}
          </div>
        </div>
      </div>
      
      <div id="bottom-elements">
        <h2 
          className="ui-textbox room-code" 
          style={{ justifyContent: 'center' }} 
          onClick={handleCopyRoomCode}
        >
          {`#${roomCode}`}
        </h2>
        <button className="ui-button" id="ready" onClick={handleJoinRoom}>Ready</button>
      </div>

    </div>
  );
};

export default Menu;
