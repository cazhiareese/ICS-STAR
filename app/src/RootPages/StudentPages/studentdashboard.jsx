import React from "react";
import { PersonStanding } from "lucide-react";
import CardComponent from "../../components/cardcomponent";

function StudentLanding() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Frontend</h1>
      <CardComponent icon={PersonStanding} text="Student Profile" />
    </div>
  );
}

export default StudentLanding;
