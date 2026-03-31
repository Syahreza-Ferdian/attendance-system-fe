export interface DayPickerProps {
  value: number[];
  onChange: (days: number[]) => void;
  error?: string;
  disabled?: boolean;
}
