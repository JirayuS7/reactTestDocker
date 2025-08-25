import { message } from "antd";
import dayjs, { Dayjs } from "dayjs";
import type { EventItem } from "../EventsListRadio";

function checkLimitEvent({
  dateRange,
  selectedEvent,
  eventSource,
  setLimitModalOpen,
}: {
  dateRange: [Dayjs | null, Dayjs | null];
  selectedEvent: EventItem[];
  eventSource: EventItem[];
  setLimitModalOpen: (open: boolean) => void;
}) {
  const eventLimit = 7;
  const startDate = dayjs(dateRange[0]);
  const endDate = dayjs(dateRange[1]);

  // For each selected event, check if adding it would exceed the limit for that user (key) on the same day
  for (let i = 0; i < selectedEvent.length; i++) {
    const event = selectedEvent[i];
    const eventKey = event.userId;
    // Check for each day in the range
    let currentDate = startDate.clone();
    while (
      currentDate.isBefore(endDate, "day") ||
      currentDate.isSame(endDate, "day")
    ) {
      // Count events for this key on this day

      const eventCount = eventSource.filter(
        (e) =>
          e.userId === eventKey && dayjs(e.start).isSame(currentDate, "day")
      ).length;

      console.log("🚀 ~ checkLimitEvent ~ eventCount:", eventCount);
      console.log("🚀 ~ checkLimitEvent ~ eventKey:", eventKey);

      if (Number(eventCount) >= Number(eventLimit)) {
        console.log("🚀 ~ success ");
        setLimitModalOpen(true);

        message.error(
          `Cannot add event for user ${eventKey} on ${currentDate.format(
            "YYYY-MM-DD"
          )}: Maximum of ${eventLimit} events allowed per user per day.`
        );
        currentDate = currentDate.add(1, "day");
        return true;
      } else {
        console.log("🚀 ~ else ~ success ");

        return false;
      }
    }
  }
}

export { checkLimitEvent };
