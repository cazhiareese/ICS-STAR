import React from 'react';
import { Lock } from 'lucide-react';

function RsvpStatus({ event }) {
  const isClosed = event?.rsvp_closed;

  const status = isClosed ? "RSVP closed" : "Accepting RSVPs";
  const color = isClosed ? "red" : "green";

  const colorClasses = {
    green: "bg-green-100 text-green-800",
    red: "bg-red-100 text-red-800",
  };

  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${colorClasses[color]}`}>
      {isClosed ? (
        <Lock className="h-4 w-4" />
      ) : (
        <span className="h-2 w-2 rounded-full bg-green-500"></span>
      )}
      {status}
    </span>
  );
}

export default RsvpStatus;
