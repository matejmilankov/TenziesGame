import { nanoid } from 'nanoid';

export const generateAllNewDice = () => {
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

export const checkWin = (currentDice) => {
  return currentDice.every(die => die.isHeld) &&
    currentDice.every(die => die.value === currentDice[0].value);
}
