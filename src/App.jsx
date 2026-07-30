import './App.css'
import { Die } from './components/Die'
import { Username } from './components/Username';
import { Timer } from './components/Timer';
import { PlayerScore } from './components/PlayerScore';
import ReactConfetti from 'react-confetti';

import { useState, useRef, useEffect } from 'react';
import { generateAllNewDice, checkWin } from './utils/diceUtils';

import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { nanoid } from 'nanoid';

import penIcon from './assets/pen-line-svgrepo-com.svg'

gsap.registerPlugin(useGSAP);


function App() {

  const buttonElem = useRef(null);
  const mainContainer = useRef(null);
  const formElem = useRef(null);

  const [rollCounter, setRollCounter] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [username, setUsername] = useState("");
  const [gameStatus, setGameStatus] = useState("setup");
  const [isEdit, setIsEdit] = useState(false);
  const [scores, setScores] = useState([
    { id: 1, username: "Stefan", rolls: 12, time: 24 },
    { id: 2, username: "Marko", rolls: 18, time: 35 },
    { id: 3, username: "Matej", rolls: 20, time: 20 },
  ]);


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

  const updateLeaderboard = () => {
    setScores(prevScores => {
      const existingPlayer = prevScores.find(prevScore => prevScore.username === username);
      if(!existingPlayer)
        return [...prevScores, {id: nanoid(), username: username, time: seconds, rolls: rollCounter}]
      if(seconds >= existingPlayer.time)
        return prevScores;
      return prevScores.map(score => 
        score.username === username
        ? {...score, time: seconds, rolls: rollCounter}
        : score
      );
    });
  }

  const hold = (id) => {
    if (gameStatus !== "playing") return;

    // Note: Ovo moze jer hold pozivam na klik. A da bi kliknuo, komponenta mora biti renderovana
    // sto znaci da sigurno radi sa najnovijom verzijom promenljive dice.
    const updatedDice = dice.map(die =>
      die.id === id ? { ...die, isHeld: !die.isHeld } : die
    );
    setDice(updatedDice);

    if (checkWin(updatedDice)) {
      setGameStatus("won");
      // Note: Isto kao sto je i promenljiva dice bila bezbedna tako su i sve unutar ove f-je
      updateLeaderboard();
    }
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
    if (!newUsername) return;
    gsap.to(formElem.current,
      {
        opacity: 0,
        height: 0,
        duration: 0.5,
        ease: "power2.out",
        onComplete: () => {
          setUsername(newUsername.trim());
          setIsEdit(false);
        }
      });
  }

  useGSAP(() => {
    if (isEdit && formElem.current) {
      gsap.fromTo(
        formElem.current,
        { opacity: 0, height: 0 },
        { opacity: 1, height: "auto", duration: 0.5, ease: "power2.out" }
      );
    }
  }, [isEdit]);

  const sortedScores = [...scores].sort((score1, score2) => score1.time - score2.time);

  return (
    <main>
      {gameStatus === "won" && <ReactConfetti />}

      {gameStatus !== "setup" ? (
        <>
          <div className="leaderboard">
            <h3>Leaderboard</h3>
            <div className="player-score">
              <p>Position</p>
              <p>Username</p>
              <p>Time</p>
              <p>Rolls</p>
            </div>
            <hr />
            <div className='players'>
              {sortedScores.map((score, index) => (
                <PlayerScore
                  key={score.id}
                  rank={`${index + 1}.`}
                  score={score}
                />
              ))}
            </div>
          </div>
          <div className='main-container'>
            <div ref={mainContainer}>


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
              <form ref={formElem} action={handleNewUsername} className='new-username-form'>
                <input type="text" name="username" placeholder='Enter new username' />
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
