import './App.css'
import { Die } from './components/Die'
import { useState } from 'react';

function App() {
  
  const generateAllNewDice = () => {
    const newDice = [];
    for(let i = 0; i < 10; i++){
      newDice[i] = Math.floor(Math.random() * 6);
    }
    return newDice;
  }

  const [dice, setDice] = useState(generateAllNewDice());

  const rollDice = () => {
    setDice(generateAllNewDice());
  }
  
  return (
    <>
      <main>
        
        <div className='dice-container'>
          {dice.map(die => <Die value={die} />)}
        </div>

        <button 
          onClick={rollDice}
          className='roll-dice'>
          Roll
          </button>

      </main>
    </>
  )
}

export default App
