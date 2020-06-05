export default function openGoogleCalendarEvent(time, teamName) {
  const baseLink = "https://calendar.google.com/calendar/render";
  const actionOption = "action=TEMPLATE";
  const textOption = `text=Team ${teamName} scheduled event`;
  const dateOption = `dates=${time}`;

  const link = `${baseLink}?${actionOption}&${textOption}&${dateOption}`;

  window.open(link);
}