import React from 'react';
import { Lock } from 'lucide-react';

function RsvpStatusBig({ event }) {
  const isClosed = event?.rsvp_closed;

  const status = isClosed ? "RSVP closed" : "Accepting RSVPs";
  const color = isClosed ? "red" : "green";

  const colorClasses = {
    green: "bg-[#27AE60]/12 text-success",
    red: "bg-[#FF0004]/10 text-error",
  };

  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-lg font-semibold ${colorClasses[color]}`}>
      {isClosed ? (
        <Lock className="h-5 w-5" />
      ) : (
        <span className="h-2.5 w-2.5 rounded-full bg-success"></span>
      )}
      {status}
    </span>
  );
}

export default RsvpStatusBig;
