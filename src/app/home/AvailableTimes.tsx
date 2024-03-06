import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import HoursSkeleton from "./HoursSkeleton";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { calendarService } from "@/services/calendarService";

export default function AvailableTimes({
  dateSelected,
  schedulingTime,
  setSchedulingTime,
}: {
  dateSelected: any;
  schedulingTime: any;
  setSchedulingTime: any;
}) {
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [loadingFreeHours, setLoadingFreeHours] = useState<boolean>(false);

  const totalTime = { start: "09", end: "18" }; //esses dados podem estar na camada da api

  useEffect(() => {
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
        <p className="mx-auto py-4">Nenhum horário disponível nessa data.</p>
      )}
    </div>
  );
}