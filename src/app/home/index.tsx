"use client";
import React, { useState, useRef } from "react";
import { useSession, signIn } from "next-auth/react";
import { format } from "date-fns";
import Header from "./Header";
import { Calendar } from "@/components/ui/calendar";
import AvailableTimes from "./AvailableTimes";
import SchedulingForm from "./SchedulingForm";
import { Button } from "@/components/ui/button";
import Image from "next/image";
function Home() {
  const test = true;
  const { data: session } = useSession();
  const container = useRef<HTMLDivElement>(null);
  const [dateSelected, setDateSelected] = useState<Date>(new Date());
  const [schedulingTime, setSchedulingTime] = useState<string>("");
  async function signInGoogle() {
    await signIn("google");
  }
  return (
    <section
      id="appointment"
      className="flex items-center justify-center flex-col h-screen"
    >
      <div>
        {session && <Header />}
        <div
          ref={container}
          className={`${
            !session ? "bg-[url('/calendar.png')] bg-no-repeat " : ""
          }flex items-center justify-center grid grid-cols-2 gap-1 rounded-lg border bg-card text-card-foreground shadow w-[720px] min-h-[360px]`}
        >
          {session ? (
            <>
              <Calendar
                mode="single"
                selected={dateSelected}
                onDayClick={setDateSelected}
              />
              <div className="flex flex-col h-full p-3">
                <h4 className="mb-3 text-md font-medium">
                  Horários disponíveis em {format(dateSelected, "dd/MM/yyyy")}
                </h4>
                <AvailableTimes
                  dateSelected={dateSelected}
                  totalTime={{ start: "09", end: "18" }}
                  schedulingTime={schedulingTime}
                  setSchedulingTime={setSchedulingTime}
                />
                <SchedulingForm
                  dateSelected={dateSelected}
                  schedulingTime={schedulingTime}
                />
              </div>
            </>
          ) : (
            <>
              <div className="bg-gradient-to-l from-white to-white/50 w-[360px] h-[360px] rounded-lg place-content-center">
                <h1 className="py-4 text-center font-bold">
                  Google Calendar App
                </h1>
              </div>
              <div className="relative w-full h-full flex align-center justify-center">
                <Button className="m-auto text-md" onClick={signInGoogle}>
                  Fazer login
                  <Image
                    style={{ marginLeft: ".8em" }}
                    src="/google.svg"
                    width={"24"}
                    height={"24"}
                    alt="Google"
                  />
                </Button>
                <div className="p-3 m-3 text-sm rounded-lg bg-gray-50 absolute bottom-0 left-0">
                  <h4 className="flex">
                    <Image
                      src="/warning.svg"
                      width={24}
                      height={24}
                      alt="warning"
                      className="me-2 mb-2"
                    />
                    <b>Este aplicativo está em modo de teste.</b>
                  </h4>
                  Para utilizar este aplicativo envie um e-mail para
                  <b> eduardosoller@gmail.com</b> solicitando seu cadastro como
                  testador.
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
export default Home;
