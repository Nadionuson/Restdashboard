import { Star } from 'lucide-react';

type Props = {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
};

export const EvaluationStars = ({ value, onChange, readOnly = false }: Props) => {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`h-5 w-5 cursor-pointer ${
            n <= value ? 'text-yellow-400' : 'text-gray-300'
          }`}
          onClick={() => !readOnly && onChange?.(n)}
          fill={n <= value ? 'currentColor' : 'none'}
        />
      ))}
    </div>
  );
};
