import { calendarRepository } from "../repositories";
import { dayEventsParams } from "../entities";
const freeHours = (data: dayEventsParams) => {
  const events = calendarRepository.getDayEvents(data);
  console.log(events);
  return events;
};
export { freeHours };
