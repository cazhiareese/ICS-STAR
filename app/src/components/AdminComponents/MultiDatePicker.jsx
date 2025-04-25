import React, { useState, useEffect } from "react"
import DatePicker from "react-multi-date-picker"
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel"


import transition from "react-element-popper/animations/transition"
import { format } from "date-fns"

export default function MultiDatePicker({ onApply, initialDates = '' }) {
  const [dates, setDates] = useState([])
  const [tempDates, setTempDates] = useState([])
  const [focusedDate, setFocusedDate] = useState()

  useEffect(() => {
    if (initialDates) {
      const parsed = initialDates.split(',').map(d => new Date(d.trim()))
      setDates(parsed)
      setTempDates(parsed)
    }
  }, [initialDates])

  const handleApply = () => {
    setDates(tempDates)
  
    const dateStrings = tempDates.map(d => format(d, "MM/dd/yyyy")).join(", ")
    const timeStrings = tempDates.map(d => format(d, "HH:mm")).join(", ")
  
    onApply({ date: dateStrings, time: timeStrings })
  }
  
  
  const handleClear = () => {
    setDates([])
    setTempDates([])
    onApply([]) // Clear formData.date/time in parent
  }  

  return (
    <div className="flex flex-col gap-2">
      <DatePicker
        value={dates}
        onChange={setTempDates}
        multiple
        sort
        onFocusedDateChange={setFocusedDate}
        onClose={() => setFocusedDate(undefined)}
        format="MM/DD/YYYY HH:mm:ss A"
        plugins={[
          <TimePicker hideSeconds position="bottom" />,
          <DatePanel markFocused focusedClassName="bg-#00369C"/>
        ]} 
        mapDays={({ date, isSameDate }) => {
          let props = {}
          
          if (!isSameDate(date, focusedDate)) return
      
          props.style = {
            backgroundColor: "#00369C",
            color: "white"
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
              title={value}
            >
              {value || "Select date and time"}
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

      {/* Apply & Clear buttons */}

    </div>
  )
}
