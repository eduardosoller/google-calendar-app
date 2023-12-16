"use client";

import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { calendarService } from "@/services/calendarService";
import { useSession, signIn, signOut } from "next-auth/react";
import { Session } from "next-auth";

import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

function Appointments() {
  const container = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const totalTime = { start: "09", end: "18" }; //esses dados podem estar na camada da api
  const [dateSelected, setDateSelected] = useState<Date>(new Date());
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingFreeHours, setLoadingFreeHours] = useState<boolean>(false);
  const [description, setDescription] = useState<string>();
  const [schedulingTime, setSchedulingTime] = useState<string>("");
  const { toast } = useToast();

  async function signInGoogle() {
    await signIn("google");
  }
  function isEmptyString(value: string) {
    return value?.length === 0;
  }

  useEffect(() => {
    setSchedulingTime("");
    setAvailableTimes([]);
    async function fetchFreeHours() {
      const date = format(dateSelected, "yyyy-MM-dd");
      try {
        setLoadingFreeHours(true);
        const response = await calendarService.getFreeHours({
          date: date,
          start: totalTime.start,
          end: totalTime.end,
        });
        setAvailableTimes(response.data);
      } catch (error) {
        console.log(error);
      }
      setLoadingFreeHours(false);
    }
    if (dateSelected) fetchFreeHours();
  }, [dateSelected, totalTime.end, totalTime.start]);

  const handleInsertEvent = async (session: Session) => {
    if (session.user) {
      const date = format(dateSelected, "yyyy-MM-dd");
      const summary = session.user.name;
      const gmt = "-03:00";
      const calendarEvent: calendarEvent = {
        summary,
        description: description ?? "",
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
        console.log(err.message);
      }
      setLoading(false);
    }
  };
  function Header() {
    return (
      <header className="flex items-center justify-between">
        <h1 className="py-4 text-center">Google Calendar App</h1>
        {session && session.user ? (
          <Popover>
            <PopoverTrigger>
              <div className="flex items-center justify-between">
                <p className="px-2">{session.user.name}</p>
                <Image
                  src={session.user.image ?? ""}
                  alt=""
                  width="30"
                  height="30"
                />
              </div>
            </PopoverTrigger>
            <PopoverContent align="end">
              <Button className="w-full mt-1 text-md" onClick={() => signOut()}>
                Fazer logout
              </Button>
            </PopoverContent>
          </Popover>
        ) : (
          <Button className="w-auto text-md" onClick={signInGoogle}>
            Fazer login
          </Button>
        )}
      </header>
    );
  }
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
            <div className="mb-auto max-w-[336px]">
              {loadingFreeHours ? (
                <div className="flex flex-wrap items-center gap-2">
                  <Skeleton className="w-[60px] h-[40px] text-md rounded-md" />
                  <Skeleton className="w-[60px] h-[40px] text-md rounded-md" />
                  <Skeleton className="w-[60px] h-[40px] text-md rounded-md" />
                  <Skeleton className="w-[60px] h-[40px] text-md rounded-md" />
                  <Skeleton className="w-[60px] h-[40px] text-md rounded-md" />
                  <Skeleton className="w-[60px] h-[40px] text-md rounded-md" />
                  <Skeleton className="w-[60px] h-[40px] text-md rounded-md" />
                  <Skeleton className="w-[60px] h-[40px] text-md rounded-md" />
                  <Skeleton className="w-[60px] h-[40px] text-md rounded-md" />
                  <Skeleton className="w-[60px] h-[40px] text-md rounded-md" />
                </div>
              ) : availableTimes.length > 0 ? (
                <ToggleGroup
                  type="single"
                  value={schedulingTime}
                  onValueChange={(value: string) => {
                    if (value) setSchedulingTime(value);
                  }}
                >
                  {availableTimes.map((item, index) => (
                    <ToggleGroupItem
                      id={`radio${index}`}
                      key={index}
                      name="horario"
                      value={item}
                      variant={"outline"}
                      className="text-md min-w-[60px]"
                    >
                      {`${item}h`}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              ) : (
                <p className="mx-auto py-4">Nenhum horário disponível</p>
              )}
            </div>
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
                      : `Confirmar ${schedulingTime}h`}
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
