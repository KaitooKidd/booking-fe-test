import Rating, { RatingProps } from '@mui/material/Rating';
import { useState } from 'react';
import { cn } from '~/utils/ui.util';

// const labels: { [index: string]: string } = {
//   0.5: 'useless',
//   1: 'useless+',
//   1.5: 'poor',
//   2: 'poor+',
//   2.5: 'ok',
//   3: 'ok+',
//   3.5: 'good',
//   4: 'good+',
//   4.5: 'excellent',
//   5: 'excellent+',
// };

const labels: { [index: string]: string } = {
  1: 'useless',
  2: 'poor',
  3: 'ok',
  4: 'good',
  5: 'excellent',
};

function getLabelText(value: number) {
  return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
}

type Props = RatingProps & {
  stars: number;
  className?: string;
  precision?: number;
  onRateChange?: (value: number) => void;
  localeConverter: (value: string) => string;
};

export default function StyledRating({
  stars,
  precision = 1,
  className = '',
  onRateChange,
  localeConverter,
  ...ratingProps
}: Props) {
  const [hover, setHover] = useState(-1);

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <Rating
        // name="styled-rating"
        value={stars}
        defaultValue={5}
        precision={precision}
        getLabelText={getLabelText}
        onChange={(_event, newValue) => {
          if (onRateChange) {
            onRateChange(newValue ?? 0);
          }
        }}
        onChangeActive={(_event, newHover) => {
          setHover(newHover);
        }}
        // emptyIcon={<Star className="opacity-55" fontSize="inherit" />}
        {...ratingProps}
      />
      {stars !== null && labels[hover !== -1 ? hover : stars] && (
        <span className="text-primary/50">{localeConverter(labels[hover !== -1 ? hover : stars])}</span>
      )}
    </div>
  );
}
