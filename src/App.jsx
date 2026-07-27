import './App.css'
import { Die } from './components/Die'
import { useState } from 'react';
import { nanoid } from 'nanoid';

function App() {

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

  const [dice, setDice] = useState(generateAllNewDice());

  const gameWon = dice.every(die => die.isHeld) && dice.every(die => die.value === dice[0].value);

  const rollDice = () => {
    setDice(prevDice => prevDice.map(prevDie => {
      return prevDie.isHeld ? prevDie : { ...prevDie, value: Math.floor(Math.random() * 6) }
    }));
  }

  const hold = (id) => {
    setDice(prevDice => prevDice.map(prevDie => {
      return prevDie.id === id ? { ...prevDie, isHeld: !prevDie.isHeld } : prevDie;
    }));
  }

  return (
    <>
      <main>

        <h1 className="title">Tenzies</h1>
        <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>

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
          className='roll-dice'>
          {gameWon ? "New game" : "Roll"}
        </button>

      </main>
    </>
  )
}

export default App
