import React from "react";
import { Newspaper,Calendar,Briefcase, User,Handshake } from "lucide-react";
import CardComponent from "../../components/cardcomponent";

function StudentLanding() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Frontend</h1>
      <CardComponent icon={Calendar} text="Look for events to attend" />
      <CardComponent icon={Newspaper} text="Catch up with ICS" />
      <CardComponent icon={Briefcase} text="Browse job opportunities" />
      <CardComponent icon={User} text="Connect with Alumni" />
      <CardComponent icon={Handshake} text="Give ICS a helping hand" />
    </div>
  );
}

export default StudentLanding;
