import React from 'react';
import { Lock } from 'lucide-react';

function RsvpStatusBig({ event }) {
  const isClosed = event?.rsvp_closed;

  const status = isClosed ? "RSVP closed" : "Accepting RSVPs";
  const color = isClosed ? "red" : "green";

  const colorClasses = {
    green: "bg-green-100 text-green-800",
    red: "bg-red-100 text-red-800",
  };

  return (
    <span className={`inline-flex items-center gap-3 rounded-full px-5 py-2 text-lg font-semibold ${colorClasses[color]}`}>
      {isClosed ? (
        <Lock className="h-6 w-6" />
      ) : (
        <span className="h-3 w-3 rounded-full bg-green-500"></span>
      )}
      {status}
    </span>
  );
}

export default RsvpStatusBig;
