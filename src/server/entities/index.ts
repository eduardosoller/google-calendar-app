export interface dayEventsParams {
  date: string;
  start: string;
  end: string;
}
export interface Event {
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
