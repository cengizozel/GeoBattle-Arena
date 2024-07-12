import React, { useEffect, useState } from 'react';
import '../../index.css';
import './Game.css';

const ARROW_KEYS = ['w', 'a', 's', 'd'];

function Game() {
  const circleColor = localStorage.getItem('circleColor') || 'black';
  console.log(circleColor)
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const [keys, setKeys] = useState({
    w: false,
    a: false,
    s: false,
    d: false
  });

  useEffect(() => {
    const loop = setInterval(() => {
      setPosition((pos) => {
        let newPos = { ...pos };

        if (keys.w) newPos.top -= 5;
        if (keys.s) newPos.top += 5;
        if (keys.a) newPos.left -= 5;
        if (keys.d) newPos.left += 5;

        return newPos;
      });
    }, 1000 / 60); // 60 fps

    return () => clearInterval(loop);
  }, [keys]);

  useEffect(() => {
    const keydownListener = (e) => {
      if (ARROW_KEYS.includes(e.key)) {
        setKeys((keys) => ({ ...keys, [e.key]: true }));
      }
    }

    const keyupListener = (e) => {
      if (ARROW_KEYS.includes(e.key)) {
        setKeys((keys) => ({ ...keys, [e.key]: false }));
      }
    }

    window.addEventListener('keydown', keydownListener);
    window.addEventListener('keyup', keyupListener);

    return () => {
      window.removeEventListener('keydown', keydownListener);
      window.removeEventListener('keyup', keyupListener);
    }
  }, []);

  return (
    <div className="ballContainer">
      <div
        className="ball"
        style={{
          position: 'relative',
          left: position.left,
          top: position.top,
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          backgroundColor: circleColor || 'black'
        }}
      />
    </div>
  );
}

export default Game;