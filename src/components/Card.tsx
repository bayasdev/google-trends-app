import { TopSearch } from '../types';

interface CardProps {
  data: TopSearch;
}

const Card: React.FC<CardProps> = ({ data }) => {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{data.topTerm}</h2>
        <p>{data.day}</p>
      </div>
    </div>
  );
};

export default Card;
