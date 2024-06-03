import React, { useEffect, useState } from "react";
import HoursSkeleton from "./HoursSkeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { format } from "date-fns";
import { calendarService } from "@/services/calendarService";

export default function AvailableTimes({
  dateSelected,
  totalTime,
  schedulingTime,
  setSchedulingTime,
}: {
  dateSelected: any;
  totalTime: { start: string; end: string };
  schedulingTime: string;
  setSchedulingTime: (value: string) => void;
}) {
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    setAvailableTimes([]);
    setSchedulingTime("");
    async function fetchFreeHours() {
      const date = format(dateSelected, "yyyy-MM-dd");
      try {
        setLoading(true);
        const response = await calendarService.getFreeHours({
          date: date,
          start: totalTime.start,
          end: totalTime.end,
        });
        if (!response) setMessage("Nenhum horário disponível nessa data.");
        setAvailableTimes(response.data);
      } catch (error: any) {
        setMessage(error.messsage);
      }
      setLoading(false);
    }
    if (dateSelected) fetchFreeHours();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateSelected]);
  return (
    <div className="mb-auto max-w-[336px]">
      {loading ? (
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
