import React from "react";
import { Newspaper, Calendar, Briefcase, User, Handshake } from "lucide-react";
import CardComponent from "../../components/cardcomponent";

function StudentLanding() {
  return (
    <div className="p-6 flex flex-col items-center">

      <h1 className="font-satoshi-medium font-bold text-[60px] leading-[60px] tracking-[-2%] text-center mb-8">
        Bridging Alumni
      </h1>


      <h2 className="text-2xl font-bold mb-4">Frontend</h2>


      <div className="grid grid-cols-2 gap-4">
        <CardComponent icon={Calendar} text="Look for events to attend" />
        <CardComponent icon={Newspaper} text="Catch up with ICS" />
        <CardComponent icon={Briefcase} text="Browse job opportunities" />
        <CardComponent icon={User} text="Connect with Alumni" />
        <CardComponent icon={Handshake} text="Give ICS a helping hand" />
      </div>
    </div>
  );
}

export default StudentLanding;
