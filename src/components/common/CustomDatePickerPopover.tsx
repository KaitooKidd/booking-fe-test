import { useTranslations } from 'next-intl';
import { Matcher } from 'react-day-picker';
import { Calendar } from '~/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';

interface DatePickerProps {
  trigger: React.ReactNode;
  selected: Date | undefined;
  // onSelect: SelectSingleEventHandler;
  onSelect: (date: Date | undefined) => void;
  disabled?: Matcher | Matcher[];
}

export default function CustomDatePickerPopover({ trigger, selected, onSelect, disabled }: DatePickerProps) {
  const t = useTranslations('Shared.datePicker');

  function handleSelectYear(year: string) {
    const newDate = new Date(selected ?? new Date());
    newDate.setFullYear(+year);
    onSelect(newDate);
  }

  function handleSelectMonth(month: string) {
    const newDate = new Date(selected ?? new Date());
    newDate.setMonth(+month);
    onSelect(newDate);
  }

  return (
    <Popover>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div aria-label="custom-date-select" className="flex gap-4 p-3 pb-0">
          <Select value={selected?.getFullYear()?.toString()} onValueChange={(value) => handleSelectYear(value)}>
            <SelectTrigger>
              <SelectValue placeholder={t('selectYear')} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Array.from({ length: 40 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select value={selected?.getMonth()?.toString()} onValueChange={(value) => handleSelectMonth(value)}>
            <SelectTrigger>
              <SelectValue placeholder={t('selectMonth')} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Array.from({ length: 12 }, (_, i) => i).map((month) => (
                  <SelectItem key={month} value={month.toString()}>
                    {month + 1}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <Calendar
          mode="single"
          month={selected}
          selected={selected}
          onSelect={onSelect}
          disabled={disabled}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
