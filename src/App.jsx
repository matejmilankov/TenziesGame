import './App.css'
import { Die } from './components/Die'
import { useState, useRef, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { Timer } from './components/Timer';
import ReactConfetti from 'react-confetti';

function App() {

  const buttonElem = useRef(null);
  const [rollCounter, setRollCounter] = useState(0);
  const [seconds, setSeconds] = useState(0);

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

  const gameWon = dice.every(die => die.isHeld) && dice.every(die => die.value === dice[0].value);

  useEffect(() => {
    if (gameWon) buttonElem.current.focus();
  }, [gameWon]);

  const rollDice = () => {
    if (!gameWon) {
      setRollCounter(prev => prev + 1);
      setDice(prevDice => prevDice.map(prevDie => {
        return prevDie.isHeld ? prevDie : { ...prevDie, value: Math.floor(Math.random() * 6) }
      }));
    } else {
      setDice(generateAllNewDice());
      setRollCounter(0);
      setSeconds(0);
    }
  }

  const hold = (id) => {
    setDice(prevDice => prevDice.map(prevDie => {
      return prevDie.id === id ? { ...prevDie, isHeld: !prevDie.isHeld } : prevDie;
    }));
  }

  useEffect(() => {
    let interval = null;
    if (!gameWon) {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameWon]);

  return (
    <>
      <main>

        {gameWon && <ReactConfetti />}

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
          {gameWon ? "New game" : "Roll"}
        </button>

      </main>
    </>
  )
}

export default App
