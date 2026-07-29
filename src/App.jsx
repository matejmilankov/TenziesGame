import './App.css'
import { Die } from './components/Die'
import { Username } from './components/Username';
import { Timer } from './components/Timer';
import ReactConfetti from 'react-confetti';

import { useState, useRef, useEffect } from 'react';
import { generateAllNewDice, checkWin } from './utils/diceUtils';

import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

import penIcon from './assets/pen-line-svgrepo-com.svg'

gsap.registerPlugin(useGSAP);


function App() {

  const buttonElem = useRef(null);
  const mainContainer = useRef(null);

  const [rollCounter, setRollCounter] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [username, setUsername] = useState("");
  const [gameStatus, setGameStatus] = useState("setup");
  const [isEdit, setIsEdit] = useState(false);


  const [dice, setDice] = useState(() => generateAllNewDice());

  const startNewGame = () => {
    setDice(generateAllNewDice());
    setRollCounter(0);
    setSeconds(0);
    setGameStatus("playing");
  }

  const rollDice = () => {
    setRollCounter(prev => prev + 1);
    setDice(prevDice => prevDice.map(prevDie => {
      return prevDie.isHeld ? prevDie : { ...prevDie, value: Math.floor(Math.random() * 6) }
    }));
  }

  const hold = (id) => {
    if (gameStatus !== "playing") return;

    setDice(prevDice => {
      const updatedDice = prevDice.map(prevDie =>
        prevDie.id === id ? { ...prevDie, isHeld: !prevDie.isHeld } : prevDie
      );

      if (checkWin(updatedDice))
        setGameStatus("won");

      return updatedDice;
    });
  }

  useEffect(() => {
    let interval = null;
    if (gameStatus === "playing") {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStatus]);

  useEffect(() => {
    if (gameStatus === "won")
      buttonElem.current.focus();
  }, [gameStatus]);

  const handleUsernameSubmit = (username) => {
    setUsername(username);
    setGameStatus("waiting");
  }

  const buttonConfig = {
    waiting: { text: "Start game", action: startNewGame },
    playing: { text: "Roll dice", action: rollDice },
    won: { text: "New game", action: startNewGame }
  }
  const currentButton = buttonConfig[gameStatus];

  useGSAP(() => {
    if (gameStatus === "waiting" && mainContainer.current) {
      gsap.fromTo(
        mainContainer.current,
        { opacity: 0, x: 30 },
        { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }
      );
    }
  }, [gameStatus]);

  const handleNewUsername = (formData) => {
    const newUsername = formData.get("username");
    setUsername(newUsername.trim());
    setIsEdit(false);
  }

  return (
    <main>

      {gameStatus !== "setup" ? (
        <>
          <div className='main-container'>
            <div ref={mainContainer}>
              {gameStatus === "won" && <ReactConfetti />}

              <h1 className="title">Tenzies</h1>
              <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>

              <div className='game-info'>
                <p>Roll pressed: {rollCounter}</p>
                <Timer seconds={seconds} />
              </div>

              <div className='dice-container'>
                {dice.map(die => (
                  <Die key={die.id}
                    value={die.value}
                    isHeld={die.isHeld}
                    hold={() => hold(die.id)}
                  />
                )
                )}
              </div>

              <button
                onClick={currentButton?.action}
                className='roll-dice'
                ref={buttonElem}>
                {currentButton?.text}
              </button>
            </div>

          </div>
          <div className='username-container' onClick={() => setIsEdit(true)}>
            <div className='username-info'>
              <img src={penIcon} alt="pen-icon" />
              <p>username: {username}</p>
            </div>
            {isEdit && (
              <form action={handleNewUsername} className='new-username-form'>
                <input type="text" name="username" placeholder='Enter new username'/>
                <button>Apply</button>
              </form>
            )}
          </div>
        </>
      ) : (
        <Username handleUsernameSubmit={handleUsernameSubmit} />
      )}

    </main>
  )
}

export default App
