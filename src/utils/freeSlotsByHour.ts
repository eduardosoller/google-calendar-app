const API_OccupiedSlots = [
  { start: "2023-08-26T16:00:00-03:00", end: "2023-08-26T18:00:00-03:00" },
  { start: "2023-08-26T18:30:00-03:00", end: "2023-08-26T19:00:00-03:00" },
  { start: "2023-08-26T21:00:00-03:00", end: "2023-08-26T21:30:00-03:00" },
  { start: "2023-08-26T21:30:00-03:00", end: "2023-08-26T22:30:00-03:00" },
];
export function calculateFreeTimeSlots(
  totalTime: { start: string; end: string },
  occupiedSlots: [{ start: string; end: string }]
) {
  const totalStartHour = Number(totalTime.start.split(":")[0]);
  const totalEndHour = Number(totalTime.end.split(":")[0]);
  const totalHours = Array.from(
    Array(totalEndHour - totalStartHour),
    (e, i) => i + totalStartHour
  );
  console.log("totalHours", totalHours);
  let slots = occupiedSlots
    .map((slot) => {
      return {
        starthour: new Date(slot.start).getHours(),
        startminutes: new Date(slot.start).getMinutes(),
        endhour: new Date(slot.end).getHours(),
        endminutes: new Date(slot.end).getMinutes(),
      };
    })
    .sort((a, b) => a.starthour - b.starthour);
  let slotsToHour = slots.map((item) => {
    return {
      start: item.starthour,
      end: item.endminutes === 0 ? item.endhour : item.endhour + 1,
    };
  });
  let occupiedHours: any = [];
  slotsToHour.forEach((slot) => {
    if (slot.end - slot.start > 1) {
      for (let i = 0; i < slot.end - slot.start; i++) {
        !occupiedHours.includes(slot.start + i) &&
          occupiedHours.push(slot.start + i);
      }
    } else {
      occupiedHours.push(slot.start);
    }
  });
  let freeHours = totalHours.filter((hour) => !occupiedHours.includes(hour));
  // console.log(slots);
  // console.log(slotsToHour);
  // console.log(occupiedHours);
  // console.log(freeHours);
  return freeHours;
}

function formatTime(hour: number) {
  return `${String(hour).padStart(2, "0")}:00`;
}
