import React, { useState, useEffect , useRef} from "react"
import DatePicker from "react-multi-date-picker"
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel"
import transition from "react-element-popper/animations/transition"
import { format } from "date-fns" // Keep date-fns for formatting output strings

export default function MultiDatePicker({ onApply, initialDates = '' }) {
  const [dates, setDates] = useState([])
  const [tempDates, setTempDates] = useState([])
  const [focusedDate, setFocusedDate] = useState()
  const pickerRef = useRef()

  // Calculate the minimum date (start of today)
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set time to midnight


  useEffect(() => {
    if (initialDates) {
      // Ensure parsing correctly handles potential time zones if needed,
      // but for yyyy-MM-dd it usually works ok.
      // Also filter out invalid dates that might result from parsing errors.
      const parsed = initialDates
        .split(',')
        .map(d => new Date(d.trim()))
        .filter(d => !isNaN(d.getTime())); // Filter out invalid dates

      // You might also want to filter out initialDates that are before today
      const validInitialDates = parsed.filter(d => d >= today);

      setDates(validInitialDates);
      setTempDates(validInitialDates);
    } else {
        // If initialDates is empty, make sure states are empty
        setDates([]);
        setTempDates([]);
    }
  }, [initialDates]); // Depend on initialDates

  const handleApply = () => {
    // Filter tempDates to ensure only valid dates (not before today) are applied
    const validTempDates = tempDates.filter(d => d >= today);

    setDates(validTempDates); // Update the main state with filtered dates

    if (validTempDates.length > 0) {
      const dateStrings = validTempDates.map(d => format(d, "yyyy-MM-dd")).join(", ")
      const timeStrings = validTempDates.map(d => format(d, "HH:mm")).join(", ")
      onApply({ date: dateStrings, time: timeStrings })
    } else {
       // If no valid dates are selected (or all were filtered out), clear the output
       onApply([])
    }

    if (pickerRef.current) pickerRef.current.closeCalendar()
  }


  const handleClear = () => {
    setDates([])
    setTempDates([])
    onApply([]) // Clear formData.date/time in parent
     if (pickerRef.current) pickerRef.current.closeCalendar() // Close on clear
  }

  return (
    <div className="flex flex-col gap-2">
      <DatePicker
        value={tempDates} // Use tempDates for the picker's internal state
        ref={pickerRef}
        onChange={setTempDates} // Update tempDates when user interacts
        multiple
        sort
        onFocusedDateChange={setFocusedDate}
        onClose={() => setFocusedDate(undefined)}
        format="MM/DD/YYYY HH:mm"
        minDate={today} // <-- Add this prop here
        plugins={[
          <TimePicker hideSeconds position="bottom" />,
          <DatePanel markFocused focusedClassName="bg-#00369C"/>
        ]}
        mapDays={({ date, isSameDate }) => {
          let props = {}

          // Existing logic for focused date styling
          if (focusedDate && isSameDate(date, focusedDate)) {
             props.style = {
               backgroundColor: "#00369C",
               color: "white"
             }
          }
          return props
        }}
        numberOfMonths={1}
        calendarPosition="bottom-left"
        animations={[transition()]}

        render={(value, openCalendar) => (
          <div className="w-full" onClick={openCalendar}>
            <div
              className="w-full overflow-hidden text-ellipsis whitespace-nowrap border border-gray-300 px-3 py-2 rounded-2xl"
              // Display formatted dates from the 'dates' state for the input value
              title={dates.map(d => format(d, "MM/dd/yyyy HH:mm")).join(", ")}
            >
              {/* Display formatted dates or placeholder */}
              {dates.length > 0 ? dates.map(d => format(d, "MM/dd/yyyy HH:mm")).join(", ") : "Select date and time"}
            </div>
          </div>
        )}
        >
      <div className="flex gap-2 items-center justify-center m-2 p-2">
        <button
          type="button"
          onClick={handleApply}
          className="px-4 py-1 rounded-3xl bg-primary text-white hover:bg-hover transition"
        >
          Apply
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="px-4 py-1 rounded-3xl bg-gray-300 text-black hover:bg-gray-400 transition"
        >
          Clear
        </button>
      </div>
      </DatePicker>
    </div>
  )
}