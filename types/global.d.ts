export { };

declare global {
  type calendarEvent = {
    summary: string | null | undefined
    description: string | undefined
    start: { dateTime: string }
    end: { dateTime: string }
  }
}