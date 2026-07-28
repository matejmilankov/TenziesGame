import './App.css'
import { Die } from './components/Die'
import { useState, useRef, useEffect } from 'react';
import { Timer } from './components/Timer';
import { Username } from './components/Username';
import { generateAllNewDice, checkWin } from './utils/diceUtils';
import ReactConfetti from 'react-confetti';


function App() {

  const buttonElem = useRef(null);
  const [rollCounter, setRollCounter] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [username, setUsername] = useState("");
  const [gameStatus, setGameStatus] = useState("setup");


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

  return (
    <main>

      {gameStatus !== "setup" ? (
        <>
          <div className='main-container'>
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
          <div className='username-container'>
            username: {username}
          </div>
        </>
      ) : (
        <Username handleUsernameSubmit={handleUsernameSubmit} />
      )}

    </main>
  )
}

export default App
