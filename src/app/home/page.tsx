"use client";

import React, { useEffect, useState, useRef } from "react";
import { format } from "date-fns";
import { calendarService } from "@/services/calendarService";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";

import Header from "./Header";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

import { useToast } from "@/components/hooks/use-toast";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Textarea } from "@/components/ui/textarea";
import AvailableTimes from "./AvailableTimes";

function Appointments() {
  const container = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const [dateSelected, setDateSelected] = useState<Date>(new Date());
  const [description, setDescription] = useState<string>("");
  const [schedulingTime, setSchedulingTime] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  function isEmptyString(value: string) {
    return value?.length === 0;
  }

  const handleInsertEvent = async (session: Session) => {
    if (session.user) {
      const date = format(dateSelected, "yyyy-MM-dd");
      const summary = session.user.name;
      const gmt = "-03:00";
      const calendarEvent: calendarEvent = {
        summary,
        description,
        start: {
          dateTime: `${date}T${schedulingTime}:00:00${gmt}`,
        },
        end: {
          dateTime: `${date}T${Number(schedulingTime) + 1}:00:00${gmt}`,
        },
      };
      try {
        setLoading(true);
        const response = await calendarService.insertEvent(calendarEvent);
        toast({
          title: response.data.message,
          description: `Dia ${format(
            dateSelected,
            "dd/MM/yyyy"
          )} às ${schedulingTime}h.`,
        });
      } catch (err: any) {
        toast({
          title: "Ocorreu um erro",
          description: err.message,
        });
      }
      setLoading(false);
    }
  };

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
            {session ? (
              <div className="flex flex-col gap-4">
                <Textarea
                  className="text-md h-[80px]"
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descrição (opcional)"
                />
                {loading ? (
                  <Button className="w-full mt-auto text-md" disabled>
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    Aguarde
                  </Button>
                ) : (
                  <Button
                    disabled={isEmptyString(schedulingTime)}
                    className="w-full mt-auto text-md"
                    onClick={() => handleInsertEvent(session!)}
                  >
                    {isEmptyString(schedulingTime)
                      ? "Selecione um horário"
                      : `Reservar horário das ${schedulingTime}h`}
                  </Button>
                )}
              </div>
            ) : (
              <small className="mx-auto py-4">
                Faça login para agendar horários.
              </small>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
export default Appointments;
