"use client";
import React, { useState, useRef } from "react";
import { format } from "date-fns";
import Header from "./Header";
import { Calendar } from "@/components/ui/calendar";
import AvailableTimes from "./AvailableTimes";
import SchedulingForm from "./SchedulingForm";

function Home() {
  const container = useRef<HTMLDivElement>(null);
  const [dateSelected, setDateSelected] = useState<Date>(new Date());
  const [schedulingTime, setSchedulingTime] = useState<string>("");

  return (
    <section id="appointment" className="flex items-center flex-col">
      <div className="flex flex-col justify-center">
        <Header />
        <div
          ref={container}
          className="grid grid-cols-2 gap-1 rounded-xl border bg-card text-card-foreground shadow"
        >
          <Calendar
            mode="single"
            selected={dateSelected}
            onDayClick={setDateSelected}
          />

          <div className="flex flex-col p-3">
            <h4 className="mb-3 text-md font-medium">
              Horários disponíveis em {format(dateSelected, "dd/MM/yyyy")}
            </h4>
            <AvailableTimes
              dateSelected={dateSelected}
              schedulingTime={schedulingTime}
              setSchedulingTime={setSchedulingTime}
            />
            <SchedulingForm
              dateSelected={dateSelected}
              schedulingTime={schedulingTime}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
export default Home;
