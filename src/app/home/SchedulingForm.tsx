import React, { useState } from "react";
import format from "date-fns/format";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/hooks/use-toast";
import { calendarService } from "@/services/calendarService";

export default function SchedulingForm({
  dateSelected,
  schedulingTime,
}: {
  dateSelected: Date;
  schedulingTime: string;
}) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  function isEmpty(value: string | number | null | undefined) {
    if (value === null || value === undefined) {
      return true;
    }
    if (typeof value === "string") {
      return value.trim() === "";
    }
    return false;
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

  function SchedulingButton() {
    return (
      <Button
        disabled={isEmpty(schedulingTime)}
        className="w-full mt-auto text-md"
        onClick={() => handleInsertEvent(session!)}
      >
        {loading ? (
          <>
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            <div>Aguarde</div>
          </>
        ) : isEmpty(schedulingTime) ? (
          "Selecione um horário"
        ) : (
          `Reservar horário das ${schedulingTime}h`
        )}
      </Button>
    );
  }

  return session ? (
    <div className="flex flex-col gap-4">
      <Textarea
        className="text-md h-[80px]"
        name="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Descrição (opcional)"
      />
      <SchedulingButton />
    </div>
  ) : (
    <small className="mx-auto py-4">Faça login para agendar horários.</small>
  );
}
