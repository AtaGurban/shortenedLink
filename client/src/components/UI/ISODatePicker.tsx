import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { formatISO, parseISO } from 'date-fns';

interface Props {
  value: string; // ISO string
  label: string
  onChange: (isoDate: string) => void;
  disabled: boolean
}

const ISODatePicker: React.FC<Props> = ({ value, onChange, label, disabled }) => {
  const date = value ? parseISO(value) : null;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        label={label}
        disabled={disabled}
        value={date}
        onChange={(newDate) => {
          if (newDate) {
            onChange(formatISO(newDate)); // формат: YYYY-MM-DD
          } else {
            onChange('');
          }
        }}
        slotProps={{
          textField: {
            variant: 'outlined',
            fullWidth: true,
          },
        }}
      />
    </LocalizationProvider>
  );
}

export default ISODatePicker