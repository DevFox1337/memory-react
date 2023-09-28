import { useEffect, useState } from 'react';
import SingleCard from './components/SingleCard/SingleCard';
import devfox from '/images/devfox.png';
import './App.scss';

// Define Card interface.
export interface Card {
  id: number;
  matched: boolean;
  src: string;
}

// Define array that contains all image (file)names for the cards.
const allCards = [
  "abe", "aryll", "beedle", "carlov", "cyclos", "dekutree", "docbandam", "fado",
  "fishman", "ganondorf", "gonzo", "granny", "greatfairy", "jabun", "joel",
  "killerbees", "king", "komali", "laruto", "lenzo", "link", "maggie", "maggiesdad",
  "manny", "mako", "medli", "merchant", "mesa", "mila", "milasdad", "mrsmarie",
  "niko", "nudge", "orca", "rose", "salvatore", "senza", "sturgeon", "suebelle",
  "tetra", "tingle",  "tott", "valoo", "zelda", "zephos", "zill", "zuko", "zunari"
// Create a new array of objects, using the .map() method. Each object will have two properties: "src" and "matched".
// The "src" property contains the path to the image and "matched" will be set to false by default.
].map(name => ({ src: `/images/${name}.png`, matched: false }));

function App() {
  // Create state for current cards, number of turns, chosen cards and game (cards) state. (Import useState!)
  const [cards, setCards] = useState<Card[]>([]);
  const [turns, setTurns] = useState(0);
  const [firstChoice, setFirstChoice] = useState<Card | null>(null);
  const [secondChoice, setSecondChoice] = useState<Card | null>(null);
  const [isDisabled, setIsDisabled] = useState(false);

  const startNewGame = () => {
    // Select 6 random cards from allCards by defining a new array
    const selectedCards = [...allCards]
      .sort(() => Math.random() - 0.5)
      .slice(0, 6)
      .map((card, index) => ({ ...card, id: index }));

    // Spread out selectedCards twice so each selected card has a duplicate (src) to match it with. There will then be 12 cards.
    // Set cards in a random order (shuffle) and add an "id" property, based on the index of the card.
    const shuffledCards = [...selectedCards, ...selectedCards]
      .sort(() => Math.random() - 0.5)
      .map((card, index) => ({ ...card, id: index }));

    //(Re)set all game variables
    setFirstChoice(null);
    setSecondChoice(null);
    setCards(shuffledCards);
    setTurns(0);
  }

  // Handle click on a card
  const handleChoice = (card: Card) => {
    // Check if chosen card is already selected or disabled. If so, do nothing.
    if (card.id === firstChoice?.id || isDisabled) return;
    // Set chosen card as secondChoice if firstChoice is set (not null). Otherwise set as firstChoice.
    firstChoice ? setSecondChoice(card) : setFirstChoice(card);
  }

  // Set up the next turn
  const resetTurn = () => {
    setFirstChoice(null);
    setSecondChoice(null);
    setTurns(prevTurns => prevTurns + 1);
    setIsDisabled(false);
  }

  // This hook fires when a first and a second choice has been set.
  useEffect(() => {
    // Check if a first choice and a second choice has been set.
    if (firstChoice && secondChoice) {
      // Disable all cards to prevent player from flipping more cards.
      setIsDisabled(true);
      // Check if the the "src" property of the first choice is equal to the second choice (= match).
      if (firstChoice.src === secondChoice.src) {
        // If true, mark the cards as matched (true) and reset the turn.
        setCards(prevCards => prevCards.map(card => card.src === firstChoice.src ? { ...card, matched: true } : card));
        resetTurn();
        // If false, wait 1 second (1000ms) and then reset the turn.
      } else {
        setTimeout(resetTurn, 1000);
      }
    }
  }, [firstChoice, secondChoice]);

  // This hook fires when the app is initialized.
  useEffect(startNewGame, []);

  return (
    <div className="app">
      <div className="game">
        <img className="game__devfox" src={devfox} alt="DevFox1337" />
        <h1 className="game__title">Wind Waker Memory</h1>
        <div className="game__card-grid">
          {cards.map(card => (
            <SingleCard
              card={card}
              key={card.id}
              flipped={card === firstChoice || card === secondChoice || card.matched}
              handleChoice={handleChoice}
              disabled={isDisabled}
            />
          ))}
        </div>
        <p className="game__turns">Turns: {turns}</p>
        <button className="game__button" onClick={startNewGame}>New Game</button>
      </div>
    </div>
  )
}

export default App;
