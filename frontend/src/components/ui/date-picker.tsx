import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  value?: string
  onChange?: (date: string | undefined) => void
  disabled?: boolean
  error?: string
}

export function DatePicker({ value, onChange, disabled, error }: DatePickerProps) {
  const date = value ? new Date(value + "T00:00:00") : undefined

  const handleSelect = (selected: Date | undefined) => {
    if (onChange) {
      onChange(selected ? format(selected, "yyyy-MM-dd") : undefined)
    }
  }

  return (
    <div className="space-y-1.5">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            data-empty={!date}
            className="w-full justify-between text-left font-normal data-[empty=true]:text-muted-foreground h-11"
          >
            {date ? format(date, "dd MMM yyyy") : <span>Pilih tanggal</span>}
            <CalendarIcon className="h-4 w-4 ml-2 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            defaultMonth={date}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
