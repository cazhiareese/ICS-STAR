import React from "react";
import { Newspaper, Calendar, Briefcase, User, Handshake } from "lucide-react";
import CardComponent from "../../components/cardcomponent";

function StudentLanding() {
  return (
    <div className="p-6 flex flex-col items-center">
      {/* Heading Wrapper */}
      <div className="flex flex-col items-center text-center">
        <h1 className="font-satoshi-bold  text-[60px] leading-[60px] tracking-[-2%]">
          Bridging Alumni
        </h1>
        <h1 className="font-satoshi-bold  text-[60px] leading-[60px] tracking-[-2%] text-primary">
          Across the Cosmos
        </h1>
      </div>

{/* Cards Section */}
<div className="flex flex-wrap justify-center gap-4 mt-6">
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
