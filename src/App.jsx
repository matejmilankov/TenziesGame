import './App.css'
import { Die } from './components/Die'
import { useState, useRef, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { Timer } from './components/Timer';
import { Username } from './components/Username';
import ReactConfetti from 'react-confetti';

function App() {

  const buttonElem = useRef(null);
  const [rollCounter, setRollCounter] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [username, setUsername] = useState("");
  const [gameStatus, setGameStatus] = useState("setup");

  const generateAllNewDice = () => {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice[i] = {
        id: nanoid(),
        value: Math.floor(Math.random() * 6),
        isHeld: false
      };
    }
    return newDice;
  }

  const [dice, setDice] = useState(() => generateAllNewDice());

  const rollDice = () => {
    switch(gameStatus) {
      case "waiting":
        setDice(generateAllNewDice());
        setGameStatus("playing");
        break;
      case "playing":
        setRollCounter(prev => prev + 1);
        setDice(prevDice => prevDice.map(prevDie => {
          return prevDie.isHeld ? prevDie : { ...prevDie, value: Math.floor(Math.random() * 6) }
        }));
        break;
      case "won":
        setDice(generateAllNewDice());
        setRollCounter(0);
        setSeconds(0);
        setGameStatus("waiting");
    }
  }

  const checkWin = (currentDice) => {
    return currentDice.every(die => die.isHeld) &&
           currentDice.every(die => die.value === currentDice[0].value);
  }

  const hold = (id) => {
    if(gameStatus != "playing") return;

    setDice(prevDice => {
      const updatedDice = prevDice.map(prevDie => 
        prevDie.id === id ? { ...prevDie, isHeld: !prevDie.isHeld } : prevDie
      );

      if(checkWin(updatedDice))
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

  const handleUsernameSubmit = (username) => {
    setUsername(username);
    setGameStatus("waiting");
  }

  return (
    <>
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
              onClick={rollDice}
              className='roll-dice'
              ref={buttonElem}>
              {gameStatus === "waiting" || gameStatus === "won" ? "New game" : "Roll"}
            </button>
          </div>
          <div className='username-container'>
            username: {username}
          </div>
          </>
        ) : (
          <Username handleUsernameSubmit={handleUsernameSubmit}/>
        )}

      </main>
    </>
  )
}

export default App
