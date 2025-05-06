import React from 'react';
import { Lock } from 'lucide-react';

function RsvpStatus({ event }) {
  const isClosed = event?.rsvp_closed;

  const status = isClosed ? "RSVP Closed" : "Accepting RSVPs";
  const color = isClosed ? "red" : "green";

  const colorClasses = {
    green: "bg-[#27AE60]/12 text-success",
    red: "bg-[#FF0004]/10 text-error",
  };

  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 rounded-full text-l font-bold cursor-default ${colorClasses[color]}`}>
      {isClosed ? (
        <Lock className="h-4 w-4 "/>
      ) : (
        <span className="h-2 w-2 rounded-full bg-green-500"></span>
      )}
      {status}
    </span>
  );
}

export default RsvpStatus;
