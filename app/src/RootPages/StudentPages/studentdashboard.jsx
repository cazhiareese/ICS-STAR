import React from "react";
import { Newspaper,Calendar,Briefcase, User,Handshake } from "lucide-react";
import CardComponent from "../../components/cardcomponent";

function StudentLanding() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Frontend</h1>
      <CardComponent icon={Calendar} text="Student Profile" />
      <CardComponent icon={Newspaper} text="Student Profile" />
      <CardComponent icon={Briefcase} text="Student Profile" />
      <CardComponent icon={User} text="Student Profile" />
      <CardComponent icon={Handshake} text="Student Profile" />
    </div>
  );
}

export default StudentLanding;
