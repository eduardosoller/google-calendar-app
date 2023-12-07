export type dayEventsParams = {
  date: string;
  start: string;
  end: string;
}
export type Event = {
  summary: string;
  description: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
}
