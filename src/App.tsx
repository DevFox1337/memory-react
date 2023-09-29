import { useEffect, useState } from 'react';
import './App.scss';

import content from './content/content.json';
import SingleCard from './components/SingleCard/SingleCard';
import foxImg from '/images/devfox.png';

export interface Card {
  id: number;
  matched: boolean;
  src: string;
}

const allCards = [...content.imageNames].map(name => ({ src: `/images/${name}.png`, matched: false }));

const cardFlipDelay = 800;
const timerInterval = 1000;

function App() {
  const [cards, setCards] = useState<Card[]>([]);
  const [isDisabledCards, setIsDisabledCards] = useState<boolean>(true);
  const [isGameActive, setIsGameActive] = useState<boolean>(false);
  const [firstChoice, setFirstChoice] = useState<Card | null>(null);
  const [secondChoice, setSecondChoice] = useState<Card | null>(null);
  const [turns, setTurns] = useState<number>(0);
  const [timer, setTimer] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  const shuffleCards = () => {
    const selectedCards = [...allCards]
      .sort(() => Math.random() - 0.5)
      .slice(0, 6)
      .map((card, index) => ({ ...card, id: index }));
      console.log(selectedCards);

    const shuffledCards = [...selectedCards, ...selectedCards]
      .sort(() => Math.random() - 0.5)
      .map((card, index) => ({ ...card, id: index }));

    setCards(shuffledCards);
  }

  const startTimer = () => {
    setTimer(setInterval(() => {
      setElapsedTime(prevElapsedTime => prevElapsedTime + 1);
    }, timerInterval));
  };

  const startNewGame = () => {
    setIsGameActive(true);
    shuffleCards();
    setFirstChoice(null);
    setSecondChoice(null);
    setTurns(0);
    setElapsedTime(0);
    setIsDisabledCards(false);
    startTimer();
  }

  const handleChoice = (card: Card) => {
    if (card.id === firstChoice?.id || isDisabledCards) return;
  
    if (firstChoice) {
      setSecondChoice(card);
      setIsDisabledCards(true);
  
      if (firstChoice.src === card.src) {
        setCards(prevCards =>
          prevCards.map(card => (card.src === firstChoice.src ? { ...card, matched: true } : card))
        );
        resetTurn();
      } else {
        setTimeout(resetTurn, cardFlipDelay);
      }
    } else {
      setFirstChoice(card);
    }
  };
  
  const resetTurn = () => {
    setFirstChoice(null);
    setSecondChoice(null);
    setTurns(prevTurns => prevTurns + 1);
    setIsDisabledCards(false);
  }

  useEffect(() => {
    const stopTimer = () => {
      if (timer) {
        clearInterval(timer);
        setTimer(null);
      }
    };

    const endGame = () => {
      stopTimer();
      setIsGameActive(false);
    };

    const allMatched = cards.every(card => card.matched);
    if (allMatched) {
      endGame();
    }
  }, [cards, timer]);

  useEffect(shuffleCards, []);

  return (
    <div className="app">
      <div className="game">
        <img className="game__fox-image" src={foxImg} alt="DevFox1337" />
        <h1 className="game__title">{content.text.title}</h1>
        <div className="game__info">
          <p className="game__info--item">{content.text.time} {elapsedTime}s</p>
          <p className="game__info--item">{content.text.turns} {turns}</p>
        </div>
        <div className="game__card-grid">
          {cards.map(card => (
            <SingleCard
              card={card}
              key={card.id}
              flipped={card === firstChoice || card === secondChoice || card.matched}
              handleChoice={handleChoice}
              disabled={isDisabledCards}
            />
          ))}
        </div>
        <button
          className={`game__button ${isGameActive ? 'game__button--disabled' : ''}`}
          onClick={startNewGame}
        >
          {isGameActive ? content.text.buttonActiveText : content.text.buttonInitialText}
        </button>
      </div>
    </div>
  )
}

export default App;