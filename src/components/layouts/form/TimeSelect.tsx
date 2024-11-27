import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';

const TIME_OPTIONS = Array.from({ length: 24 }, (_, index) => {
  return `${index.toString().padStart(2, '0')}:00`;
});

interface TimeSelectProps {
  value: string | undefined;
  onChange: (value: string) => void;
}

export default function TimeSelect({ value, onChange }: TimeSelectProps) {
  return (
    <Select
      defaultValue={value}
      onValueChange={onChange}
      // onValueChange={(time) => {
      //   const newValue = time === value ? '' : time; // NOTE: issue - does not call onChange if the value is the same
      //   onChange(newValue);
      // }}
    >
      <SelectTrigger className="w-[180px]">{value ? <SelectValue placeholder="--" /> : '--'}</SelectTrigger>
      <SelectContent>
        {TIME_OPTIONS.map((time, index) => (
          <SelectItem key={index} value={time}>
            {time}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
