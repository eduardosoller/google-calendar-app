import React, { useEffect, useState } from "react";
import HoursSkeleton from "./HoursSkeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { format } from "date-fns";
import { calendarService } from "@/services/calendarService";

export default function AvailableTimes({
  dateSelected,
  schedulingTime,
  setSchedulingTime,
}: {
  dateSelected: any;
  schedulingTime: string;
  setSchedulingTime: (value: string) => void;
}) {
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [loadingFreeHours, setLoadingFreeHours] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const totalTime = { start: "09", end: "18" }; //esses dados podem estar na api

  useEffect(() => {
    setAvailableTimes([]);
    setSchedulingTime("");
    setMessage("Nenhum horário disponível nessa data.");
    async function fetchFreeHours() {
      const date = format(dateSelected, "yyyy-MM-dd");
      try {
        setLoadingFreeHours(true);
        const response = await calendarService.getFreeHours({
          date: date,
          start: totalTime.start,
          end: totalTime.end,
        });
        //console.log("getFreeHours", response.data);
        setAvailableTimes(response.data);
      } catch (error) {
        setMessage("Ocorreu um erro.Tente novamente mais tarde.");
        console.log(error);
      }
      setLoadingFreeHours(false);
    }
    if (dateSelected) fetchFreeHours();
  }, [dateSelected, totalTime.end, totalTime.start]);
  return (
    <div className="mb-auto max-w-[336px]">
      {loadingFreeHours ? (
        <div className="flex flex-wrap items-center gap-2">
          <HoursSkeleton />
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
        <p className="mx-auto py-4">{message}</p>
      )}
    </div>
  );
}
