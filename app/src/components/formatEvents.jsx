import dayjs from 'dayjs'; // (make sure you have installed dayjs)

export default function  formatEvents  (eventList) {
  // group by days_left if multiple events
  const grouped = {};

  eventList.forEach(event => {
    const dayLabel = event.days_left === 1
      ? "Tomorrow"
      : `In ${event.days_left} days`;

    const timeFormatted = dayjs(event.date).format('h:mm A');

    if (!grouped[dayLabel]) {
      grouped[dayLabel] = [];
    }

    grouped[dayLabel].push({
      title: event.title,
      time: `${timeFormatted}, ${event.location}`
    });
  });

  // convert grouped object into array
  const events = Object.entries(grouped).map(([dateLabel, items]) => ({
    dateLabel,
    items
  }));

  return events;
};
