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
    <span className={`inline-flex items-center gap-3 rounded-full px-5 py-2 text-xl font-bold ${colorClasses[color]}`}>
      {isClosed ? (
        <Lock className="h-6 w-6" />
      ) : (
        <span className="h-3 w-3 rounded-full bg-success"></span>
      )}
      {status}
    </span>
  );
}

export default RsvpStatusBig;
