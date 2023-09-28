import { Card } from '../../App';
import './SingleCard.scss';

// Define componnent props.
interface SingleCardProps {
  card: Card;
  flipped: boolean;
  handleChoice: (card: Card) => void;
  disabled: boolean;
}

export default function SingleCard({ card, flipped, handleChoice, disabled}: SingleCardProps) {
  // Handle click on card
  const handleClick = () => {
    if (!disabled) {
      handleChoice(card);
    }
  }

  return (
    <div className="card">
      <div className={flipped ? "card__flipped" : ""}>
        <img className="card__image card__front" src={card.src} alt="card front" />
        <img
          className="card__image card__back"
          src="src/assets/images/card-back.png"
          onClick={handleClick}
          alt="card back" />
      </div>
    </div>
  )
}