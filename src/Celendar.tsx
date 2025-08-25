import dayGridPlugin from "@fullcalendar/daygrid";
import multiMonthPlugin from "@fullcalendar/multimonth";
import timeGridPlugin from "@fullcalendar/timegrid";
import FullCalendar from "@fullcalendar/react";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";
// import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useRef, useState, useCallback } from "react";
import {
  Button,
  Col,
  Modal,
  Row,
  Space,
  Tooltip,
  DatePicker,
  TimePicker,
  Form,
  notification,
  message,
} from "antd";
import { LinkOutlined, EditOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import "./Calendar.css"; // Import the CSS file
import interactionPlugin from "@fullcalendar/interaction";
import EventsListRadio from "./EventsListRadio";
import { events } from "./eventsMokup";
import { checkLimitEvent } from "./services/checkLimitEvent";

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end?: Date;
  color?: string;
  userId: number;
  key?: string;
}

interface FullCalendarEventInfo {
  event: {
    id: string;
    title: string;
    start: Date | null;
    end: Date | null;
    backgroundColor?: string;
    borderColor?: string;
    extendedProps: {
      key?: string;
      timeSlot?: string;
      startTime?: string;
      endTime?: string;
      [key: string]: unknown;
    };
    remove: () => void;
  };
  revert?: () => void;
}

interface DayCellContentArg {
  date: Date;
  dayNumberText: string;
  isOther: boolean;
}

export default function Calendar() {
  const calendarRef = useRef<FullCalendar>(null);

  const [isDotView] = useState(true); // New state for dot view toggle
  const [currentView, setCurrentView] = useState("dayGridMonth"); // Track current view
  const [eventLimitModal, setEventLimitModal] = useState(false);
  const [limitWarningInfo, setLimitWarningInfo] = useState<{
    date: string;
    eventCount: number;
  } | null>(null);
  const [limitModalOpen, setLimitModalOpen] = useState(false);
  // Maximum events allowed per date
  const MAX_EVENTS_PER_DATE = 7;

  // Helper function to count events on a specific date
  const countEventsOnDate = useCallback(
    (targetDate: Date, eventsList: CalendarEvent[]) => {
      const targetDateStr = dayjs(targetDate).format("YYYY-MM-DD");
      return eventsList.filter((event) => {
        const eventDateStr = dayjs(event.start).format("YYYY-MM-DD");
        return eventDateStr === targetDateStr;
      }).length;
    },
    []
  );

  // Custom day cell content to show event count and warnings
  const renderDayCellContent = (dayInfo: DayCellContentArg) => {
    const date = dayInfo.date;
    const dayNumber = dayInfo.dayNumberText;
    const eventsCount = countEventsOnDate(date, allEvents);

    let backgroundColor = "";
    let textColor = "";
    let warningIcon = null;

    if (eventsCount >= MAX_EVENTS_PER_DATE) {
      // backgroundColor = "#fff2f0";
      // textColor = "#ff4d4f";
      // warningIcon = (
      //   <CloseCircleOutlined style={{ fontSize: "10px", marginLeft: "2px" }} />
      // );
    } else if (eventsCount >= MAX_EVENTS_PER_DATE - 2) {
      backgroundColor = "#fff7e6";
      textColor = "#fa8c16";
      warningIcon = (
        <WarningOutlined style={{ fontSize: "10px", marginLeft: "2px" }} />
      );
    }

    return (
      <div
        style={{
          backgroundColor,
          color: textColor,
          padding: "2px 4px",
          borderRadius: "3px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "12px",

          fontWeight:
            eventsCount >= MAX_EVENTS_PER_DATE - 2 ? "bold" : "normal",
        }}
      >
        {dayNumber}
        {warningIcon}
        {eventsCount > 0 && (
          <span
            style={{
              fontSize: "8px",
              marginLeft: "2px",
              opacity: 0.7,
            }}
          >
            ({eventsCount})
          </span>
        )}
      </div>
    );
  };

  // Store the original/full events list separately from filtered view
  const [allEvents, setAllEvents] = useState(() => {
    const savedEvents = localStorage.getItem("calendarEvents");
    if (savedEvents) {
      try {
        const parsedEvents = JSON.parse(savedEvents);
        interface CalendarEvent {
          id: string;
          title: string;
          start: Date | string;
          end?: Date | string;
          color?: string;
          key?: string;
        }
        return parsedEvents.map((event: CalendarEvent) => ({
          ...event,
          start: new Date(event.start),
          end: event.end ? new Date(event.end) : undefined,
        }));
      } catch (error) {
        console.error("Error parsing saved events:", error);
        return events;
      }
    }
    return events;
  });

  // Filtered events for display (based on selected user)
  const [eventsList, setEventsList] = useState(() => {
    const savedEvents = localStorage.getItem("calendarEvents");
    if (savedEvents) {
      try {
        const parsedEvents = JSON.parse(savedEvents);

        return parsedEvents.map((event: CalendarEvent) => ({
          ...event,
          start: new Date(event.start),
          end: event.end ? new Date(event.end) : undefined,
        }));
      } catch (error) {
        console.error("Error parsing saved events:", error);
        return events;
      }
    }
    return events;
  });

  const [userEvents] = useState([
    {
      key: "1",
      userId: 1,
      title: "Alex bot Brown",
    },
    {
      key: "2",
      userId: 2,
      title: "Samantha Brown",
    },
    {
      key: "3",
      userId: 3,
      title: "Desmond Brown",
    },
    {
      key: "4",
      userId: 4,
      title: "Charlie Brown",
    },
  ]);

  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [eventDetailModal, setEventDetailModal] = useState(false);
  const [eventEditModal, setEventEditModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<{
    title: string;
    start: Date;
    end?: Date;
    id: string;
    color?: string;
    key?: string;
    userId?: number;
  } | null>(null);
  const [editingEvent, setEditingEvent] = useState<{
    title: string;
    start: Date;
    end?: Date;
    id: string;
    color?: string;
    key?: string;
    userId?: number;
  } | null>(null);

  // Function to save events to localStorage
  const saveEventsToLocalStorage = useCallback((events: typeof allEvents) => {
    try {
      localStorage.setItem("calendarEvents", JSON.stringify(events));
      console.log("Events saved to localStorage:", events.length, "events");
    } catch (error) {
      console.error("Error saving events to localStorage:", error);
      message.error("Failed to save events to local storage");
    }
  }, []);

  // Function to reset events to original data
  const resetEventsToOriginal = () => {
    setAllEvents(events);
    setEventsList(events);
    localStorage.removeItem("calendarEvents");
    message.success("Events reset to original data");
  };

  // Save events to localStorage whenever allEvents changes
  useEffect(() => {
    if (allEvents !== events) {
      // Only save if events have been modified
      saveEventsToLocalStorage(allEvents);
    }
  }, [allEvents, saveEventsToLocalStorage]);

  const handleEventReceive = (info: FullCalendarEventInfo) => {
    console.log("🚀 ~ handleEventReceive ~ info:", info);
    // Check if the event has time information from the dragged button
    const timeSlot = info.event.extendedProps?.timeSlot;
    const startTime = info.event.extendedProps?.startTime;
    const endTime = info.event.extendedProps?.endTime;

    checkLimitEvent({
      dateRange: [dayjs(info.event.start), dayjs(info.event.end)],
      selectedEvent: [
        {
          key: info.event.id,
          title: info.event.title,
          start: info.event.start as Date,
          end: info.event.end as Date,
          // color: info.event.color,
          userId: Number(info.event.extendedProps?.userId),
        },
      ],
      eventSource: allEvents,
      setLimitModalOpen: setEventLimitModal,
    });

    if (timeSlot && startTime && endTime && info.event.start) {
      // Check event limit for the target date
      const targetDate = info.event.start;
      const eventsOnTargetDate = countEventsOnDate(targetDate, allEvents);

      if (eventsOnTargetDate >= MAX_EVENTS_PER_DATE) {
        // Show warning modal and prevent event creation
        setLimitWarningInfo({
          date: dayjs(targetDate).format("YYYY-MM-DD"),
          eventCount: eventsOnTargetDate,
        });
        setEventLimitModal(true);
        // Always remove the temporary event
        info.event.remove();
        return;
      }

      // Automatically create event with the predefined time
      const eventDate = info.event.start;
      const startDate = new Date(eventDate);
      const [startHour, startMinute] = startTime.split(":").map(Number);
      startDate.setHours(startHour, startMinute, 0, 0);

      const endDate = new Date(eventDate);
      const [endHour, endMinute] = endTime.split(":").map(Number);
      endDate.setHours(endHour, endMinute, 0, 0);

      const color = timeSlot === "morning" ? "green" : "blue";

      const newEvent = {
        id: `event-${Date.now()}`,
        title: info.event.title,
        start: startDate,
        end: endDate,
        color: color,
        userId: 1, // Default userId for dropped events
      };

      // check Duplicate
      interface CalendarEvent {
        id: string;
        title: string;
        start: Date;
        end?: Date;
        color?: string;
        key?: string;
        userId: number;
      }

      const newList: CalendarEvent[] = allEvents.filter(
        (event: CalendarEvent) => event.title !== newEvent.title
      );
      // Add to events list
      const updatedAllEvents = [...newList, newEvent];
      setAllEvents(updatedAllEvents);

      // Update filtered list based on current user selection
      if (selectedUser) {
        const filteredEvents = updatedAllEvents.filter(
          (event) => event.userId === selectedUser
        );
        setEventsList(filteredEvents);
      } else {
        setEventsList(updatedAllEvents);
      }

      // Switch calendar to the month of the newly added event if not already in view
      if (calendarRef.current && newEvent.start) {
        const calendarApi = calendarRef.current.getApi();
        const newEventMonth = newEvent.start.getMonth();
        const newEventYear = newEvent.start.getFullYear();
        const currentDate = calendarApi.getDate();
        if (
          currentDate.getMonth() !== newEventMonth ||
          currentDate.getFullYear() !== newEventYear
        ) {
          calendarApi.changeView("dayGridMonth", newEvent.start);
        }
      }
    }
    // Always remove the temporary event that FullCalendar creates
    info.event.remove();
  };

  useEffect(() => {
    if (selectedUser) {
      interface CalendarEvent {
        id: string;
        title: string;
        start: Date;
        end?: Date;
        color?: string;
        key?: string;
        userId: number;
      }

      const selectedUserEvents: CalendarEvent[] = allEvents.filter(
        (item: CalendarEvent) => item.userId === selectedUser
      );
      setEventsList(selectedUserEvents);
    } else {
      setEventsList(allEvents);
    }
  }, [selectedUser, allEvents]);

  // Handle event resize to change duration
  const handleEventResize = (info: FullCalendarEventInfo) => {
    // const startDate = info.event.start;
    // const allEvent = allEvents;

    if (!info.event.start) return;

    const updatedEvent: CalendarEvent = {
      id: info.event.id,
      title: info.event.title,
      start: info.event.start,
      end: info.event.end || undefined,
      color: info.event.backgroundColor || info.event.borderColor || "#3788d8",
      userId:
        typeof info.event.extendedProps.userId === "number"
          ? info.event.extendedProps.userId
          : 1,
    };

    // Update allEvents
    const updatedAllEvents = allEvents.map((event: CalendarEvent) =>
      event.id === updatedEvent.id ? updatedEvent : event
    );
    setAllEvents(updatedAllEvents);

    // Update filtered events
    setEventsList((prevEvents: CalendarEvent[]) =>
      prevEvents.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );

    const duration = dayjs(info.event.end).diff(
      dayjs(info.event.start),
      "hour",
      true
    );
    message.success(
      `Event "${info.event.title}" duration changed to ${duration} hours`
    );
  };

  // Handle event removal with confirmation
  const handleEventRemove = useCallback(
    (eventId: string) => {
      // Update allEvents (source of truth)
      const updatedAllEvents = allEvents.filter(
        (event: CalendarEvent) => event.id !== eventId
      );
      setAllEvents(updatedAllEvents);

      // Update filtered events list
      setEventsList((prevEvents: CalendarEvent[]) =>
        prevEvents.filter((event) => event.id !== eventId)
      );

      // Close modals
      setEventEditModal(false);
      setEventDetailModal(false);
      setSelectedEvent(null);

      // Show success message
      message.success("Event removed successfully");
    },
    [allEvents]
  );

  // Handle keyboard shortcuts for event operations
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Delete key to remove selected event
      if (event.key === "Delete" && selectedEvent && eventDetailModal) {
        event.preventDefault();
        handleEventRemove(selectedEvent.id);
      }
      // Escape key to close modal
      if (event.key === "Escape" && eventDetailModal) {
        setEventDetailModal(false);
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [selectedEvent, eventDetailModal, handleEventRemove]);

  // Handle manual event editing through form
  interface EventEditFormValues {
    date: dayjs.Dayjs;
    startTime: dayjs.Dayjs;
    endTime?: dayjs.Dayjs;
    title?: string;
  }

  const handleEventEdit = (values: EventEditFormValues) => {
    if (!editingEvent) return;

    const startDate = dayjs(values.date)
      .hour(dayjs(values.startTime).hour())
      .minute(dayjs(values.startTime).minute())
      .toDate();

    const endDate = values.endTime
      ? dayjs(values.date)
          .hour(dayjs(values.endTime).hour())
          .minute(dayjs(values.endTime).minute())
          .toDate()
      : undefined;

    const updatedEvent = {
      id: editingEvent.id,
      title: editingEvent.title,
      start: startDate,
      end: endDate,
      color: editingEvent.color || "#3788d8",
      userId: editingEvent.userId || 1,
    };

    // Update allEvents
    const updatedAllEvents = allEvents.map((event: CalendarEvent) =>
      event.id === editingEvent.id ? updatedEvent : event
    );
    setAllEvents(updatedAllEvents);

    // Update filtered events
    setEventsList((prevEvents: CalendarEvent[]) =>
      prevEvents.map((event) =>
        event.id === editingEvent.id ? updatedEvent : event
      )
    );

    setEventEditModal(false);
    setEditingEvent(null);
    message.success(`Event "${editingEvent.title}" updated successfully`);
  };

  // const handleTimeSelection = (startHour: number, endHour: number) => {
  //   if (!droppedEventInfo) return;

  //   const { date, draggedEl } = droppedEventInfo;
  //   const title =
  //     draggedEl.innerText ||
  //     (draggedEl.getAttribute("data-event-title") ?? "New Event");

  //   const startDate = new Date(date);
  //   startDate.setHours(startHour, 0, 0, 0);

  //   const endDate = new Date(date);
  //   endDate.setHours(endHour, 0, 0, 0);

  //   let color = "#00000";

  //   if (startHour < 12) {
  //     color = "green";
  //   }

  //   if (startHour > 12) {
  //     color = "blue";
  //   }

  //   const newEvent = {
  //     id: `event-${Date.now()}`,
  //     title: title,
  //     start: startDate,
  //     end: endDate,
  //     color: color,
  //   };

  //   setEventsList((prevEvents) => [...prevEvents, newEvent]);
  //   setExternalEvents((prevEvents) =>
  //     prevEvents.filter((event) => event.title !== title)
  //   );

  //   // Also remove the original dragged element from the DOM
  //   draggedEl.remove();

  //   // setIsModalOpen(false);
  //   setDroppedEventInfo(null);
  // };

  const updateMonthTitles = () => {
    setTimeout(() => {
      updateToolTip();
    }, 500);

    // if (currentView !== "multiMonth") return;

    const calendarApi = calendarRef.current && calendarRef.current.getApi();
    const allEvents = calendarApi ? calendarApi.getEvents() : [];

    // Count events per month/year
    const monthEventCounts: { [key: string]: number } = {};
    allEvents.forEach((evt) => {
      const date = evt.start;
      if (!date) return;
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const key = `${year}-${month}`;
      monthEventCounts[key] = (monthEventCounts[key] || 0) + 1;
    });

    // Update the month header labels in Year view
    document.querySelectorAll(".fc-multimonth-title").forEach((titleEl) => {
      const match =
        titleEl.textContent &&
        titleEl.textContent.match(/^([A-Za-z]+)\s?(\d{4})?$/);

      if (match) {
        const monthName = match[1];
        const year = match[2] || new Date().getFullYear();
        const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth() + 1;
        const key = `${year}-${monthIndex}`;
        console.log("🚀 ~ updateMonthTitles ~ key:", key);
        const count = monthEventCounts[key] || 0;
        // Show as "MonthName (count)"
        titleEl.innerHTML = `  <span class="event-count"> (${count})</span> `;
      }
    });

    // make link to month view
    //  change tag div.fc-multimonth-title to be <a></a>
    document.querySelectorAll(".fc-multimonth-title").forEach((titleEl) => {
      // Skip if already has a link
      if (titleEl.querySelector("a")) return;

      const link = document.createElement("a");
      link.href = "#";
      link.style.textDecoration = "none";
      link.style.color = "inherit";
      link.style.cursor = "pointer";

      // Get month information for navigation
      const monthElement = titleEl.closest(".fc-multimonth-month");
      const monthDateStr = monthElement?.getAttribute("data-date");

      link.addEventListener("click", (e) => {
        e.preventDefault();
        if (monthDateStr) {
          const monthDate = new Date(monthDateStr + "T00:00:00");
          handleDateClick(monthDate);
        }
      });

      link.innerHTML = titleEl.innerHTML;
      titleEl.innerHTML = "";
      titleEl.appendChild(link);
    });
  };
  console.log("🚀 ~ updateMonthTitles ~ updateMonthTitles:", updateMonthTitles);
  console.log("🚀 ~ updateMonthTitles ~ updateMonthTitles:", updateMonthTitles);

  const updateToolTip = () => {
    // change tool tip
    document.querySelectorAll(".day-event-title").forEach((titleEl) => {
      const eventText = titleEl.textContent || "";

      titleEl.setAttribute("title", eventText); // Truncate text with ellipsis
    });
  };

  const handleDateClick = (date: Date) => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.changeView("dayGridMonth", date);
    }
  };

  const EventLimitModal = (
    <Modal
      title="Event Limit Reached"
      open={eventLimitModal}
      onCancel={() => setEventLimitModal(false)}
      footer={[
        <Button
          key="ok"
          type="primary"
          onClick={() => setEventLimitModal(false)}
        >
          OK, I understand
        </Button>,
      ]}
      width={500}
    >
      {limitWarningInfo && (
        <Space direction="vertical" style={{ width: "100%" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <CloseCircleOutlined
              style={{
                color: "#ff4d4f",
                fontSize: "24px",
                marginRight: "12px",
              }}
            />
            <div>
              <h3 style={{ margin: 0, color: "#ff4d4f" }}>
                Cannot Add More Events
              </h3>
              <p style={{ margin: "4px 0 0 0", color: "#666" }}>
                Maximum event limit reached for this date
              </p>
            </div>
          </div>

          <div
            style={{
              background: "#fff2f0",
              border: "1px solid #ffccc7",
              borderRadius: "6px",
              padding: "12px",
              marginBottom: "16px",
            }}
          >
            <div>
              <strong>Date:</strong>{" "}
              {dayjs(limitWarningInfo.date).format("dddd, MMMM D, YYYY")}
            </div>
            <div>
              <strong>Current Events:</strong> {limitWarningInfo.eventCount}
            </div>
            <div>
              <strong>Maximum Allowed:</strong> {MAX_EVENTS_PER_DATE} events per
              day
            </div>
          </div>

          <div
            style={{
              background: "#f6ffed",
              border: "1px solid #b7eb8f",
              borderRadius: "6px",
              padding: "12px",
            }}
          >
            <strong>💡 Suggestions:</strong>
            <ul style={{ margin: "8px 0 0 0", paddingLeft: "20px" }}>
              <li>Try adding the event to a different date</li>
              <li>Remove an existing event from this date first</li>
              <li>Consider combining similar events</li>
            </ul>
          </div>
        </Space>
      )}
    </Modal>
  );

  const EditEventModal = (
    <Modal
      title="Edit Event"
      open={eventEditModal}
      onCancel={() => {
        setEventEditModal(false);
        setEditingEvent(null);
      }}
      footer={null}
      width={600}
    >
      {editingEvent && (
        <Form
          layout="vertical"
          onFinish={handleEventEdit}
          initialValues={{
            date: dayjs(editingEvent.start),
            startTime: dayjs(editingEvent.start),
            endTime: editingEvent.end ? dayjs(editingEvent.end) : undefined,
          }}
        >
          <Form.Item
            label="Event Title"
            name="title"
            initialValue={editingEvent.title}
          >
            <div
              style={{
                padding: "8px",
                background: "#f5f5f5",
                borderRadius: "4px",
              }}
            >
              {editingEvent.title}
            </div>
          </Form.Item>

          <Form.Item
            label="Date"
            name="date"
            rules={[{ required: true, message: "Please select a date" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Space size="large" style={{ width: "100%" }}>
            <Form.Item
              label="Start Time"
              name="startTime"
              rules={[{ required: true, message: "Please select start time" }]}
            >
              <TimePicker format="HH:mm" />
            </Form.Item>

            <Form.Item label="End Time" name="endTime">
              <TimePicker format="HH:mm" />
            </Form.Item>
          </Space>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Update Event
              </Button>
              <Button
                onClick={() => {
                  setEventEditModal(false);
                  setEditingEvent(null);
                }}
              >
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );

  const EventDetailModal = (
    <Modal
      title="Event Details"
      open={eventDetailModal}
      onCancel={() => setEventDetailModal(false)}
      footer={[
        <Button
          key="edit"
          onClick={() => {
            setEditingEvent(selectedEvent);
            setEventDetailModal(false);
            setEventEditModal(true);
          }}
          icon={<EditOutlined />}
        >
          Edit Event
        </Button>,
        <Button
          key="see-more"
          onClick={() => setEventDetailModal(false)}
          color="default"
          variant="dashed"
        >
          <LinkOutlined /> See More
        </Button>,
        <Button
          key="Remove"
          onClick={() => {
            if (selectedEvent) {
              handleEventRemove(selectedEvent.id);
            }
          }}
          color="danger"
          variant="dashed"
        >
          <CloseCircleOutlined /> Remove
        </Button>,
        <Button key="close" onClick={() => setEventDetailModal(false)}>
          Close
        </Button>,
      ]}
      width={600}
    >
      {selectedEvent && (
        <Space direction="vertical" style={{ width: "100%" }}>
          <div>
            <strong>Title:</strong> {selectedEvent.title}
          </div>

          <div>
            <strong>User :</strong>{" "}
            {userEvents.find((user) => user.userId === selectedEvent.userId)
              ?.title || "All Users"}
          </div>
          <div>
            <strong>Start:</strong>{" "}
            {dayjs(selectedEvent.start).format("YYYY-MM-DD HH:mm")}
          </div>
          {selectedEvent.end && (
            <div>
              <strong>End:</strong>{" "}
              {dayjs(selectedEvent.end).format("YYYY-MM-DD HH:mm")}
            </div>
          )}
          <div>
            <strong>Duration:</strong>{" "}
            {selectedEvent.end
              ? `${dayjs(selectedEvent.end).diff(
                  dayjs(selectedEvent.start),
                  "hour",
                  true
                )} hours`
              : "All day"}
          </div>
          <div>
            <strong>Description:</strong>
            <div
              style={{
                background: "#f5f5f5",
                padding: "10px",
                borderRadius: "4px",
                marginTop: "8px",
                maxHeight: "200px",
                overflowY: "auto",
              }}
            >
              {selectedEvent.title.length > 100 ? (
                <>
                  {selectedEvent.title}
                  <br />
                  <br />
                  <em>
                    This is a sample description for the event. You can add more
                    detailed information about the event here, including
                    location, attendees, agenda, and any other relevant details.
                  </em>
                </>
              ) : (
                selectedEvent.title
              )}
            </div>
          </div>

          <div
            style={{
              marginTop: "16px",
              padding: "8px",
              background: "#f0f0f0",
              borderRadius: "4px",
              fontSize: "12px",
              color: "#666",
            }}
          >
            <strong>Keyboard Shortcuts:</strong> Delete key to remove event, Esc
            to close modal
          </div>
        </Space>
      )}
    </Modal>
  );

  const [api, contextHolder] = notification.useNotification();

  const openNotification = () => {
    api.open({
      message: "Saved Successfully",

      icon: (
        <>
          <CheckCircleOutlined style={{ color: "#52c41a", marginLeft: 8 }} />
        </>
      ),
    });
  };

  return (
    <div>
      {contextHolder}
      {EventLimitModal}
      {EditEventModal}
      {EventDetailModal}
      {/* {ModalConfirm}{" "} */}
      <h2> Event Title : Monthly meeting</h2>
      <hr />
      <Row
        gutter={[16, 16]}
        style={{
          marginTop: 30,
        }}
      >
        <Col span={6}>
          <EventsListRadio
            events={userEvents}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            eventsList={eventsList}
            setEventsList={setEventsList}
            limitModalOpen={limitModalOpen}
            setLimitModalOpen={setLimitModalOpen}
            onNavigateToDate={handleDateClick}
          />
          {/* <UserLists /> */}
        </Col>
        <Col span={18}>
          <div className="calendar-container">
            {/* Toggle button for year view */}
            {currentView === "multiMonthYear" && (
              <div
                style={{ marginBottom: 16, textAlign: "right", flexShrink: 0 }}
              >
                <Tooltip
                  title={
                    isDotView
                      ? "Switch to show full event titles"
                      : "Switch to show events as dots"
                  }
                ></Tooltip>
              </div>
            )}

            <div className="calendar-wrapper">
              <FullCalendar
                ref={calendarRef}
                plugins={[
                  dayGridPlugin,
                  multiMonthPlugin,
                  timeGridPlugin,
                  interactionPlugin,
                ]}
                initialView="dayGridMonth"
                editable={true}
                droppable={true}
                events={eventsList}
                height="100vh" // Set explicit height
                dayCellContent={renderDayCellContent} // Custom day cell content with event count
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "timeGridDay,timeGridWeek,dayGridMonth,multiMonthYear",
                }}
                // customButtons={{
                //   dotToggle: {
                //     text: isDotView ? "Show Titles" : "Show Dots",
                //     click: () => setIsDotView(!isDotView),
                //   },
                // }}

                // eventContent={renderEventWithTooltip} // Apply custom rendering
                views={{
                  timeGridDay: {
                    type: "timeGrid",
                    eventMaxStack: 7,
                    buttonText: "Day",
                    slotMinTime: "06:00:00",
                    slotMaxTime: "22:00:00",
                    // allDaySlot: true,
                    slotDuration: "00:30:00", // 30-minute time slots
                    scrollTime: "08:00:00", // Scroll to 8 AM by default
                    eventClassNames: "day-event-title",
                    contentHeight: "auto",
                    expandRows: true,
                    slotEventOverlap: true,
                    buttonIcons: {
                      prev: "chevron-left",
                      next: "chevron-right",
                      today: "today",
                    },
                    // dayMaxEventRows: 7,
                  },
                  dayGridMonth: {
                    type: "dayGrid",
                    duration: { months: 1 },
                    buttonText: "Month",
                    dayMaxEvents: 5, // Show max 5 events then "read more"
                    eventClassNames: "day-event-title",
                  },
                  multiMonthYear: {
                    type: "multiMonth",
                    duration: { years: 1 },
                    buttonText: "Year",
                    eventClassNames: "day-event-title",
                    // dayCount: 365,
                    multiMonthTitleFormat: {
                      month: "long",
                    },

                    // Display events as dots in year view based on toggle
                    eventDisplay: isDotView ? "dot" : "block",
                    dayMaxEvents: isDotView ? 1 : 2, // Show max 1 dot then "+more" for better control
                    // Add these for better year view control
                    contentHeight: "auto",
                    aspectRatio: 1.35, // Adjust this to control month layout
                  },
                  timeGridWeek: {
                    type: "timeGrid",
                    duration: { weeks: 1 },
                    buttonText: "Week",
                    slotMinTime: "06:00:00",
                    slotMaxTime: "22:00:00",
                    allDaySlot: true,
                    dayMaxEventRows: 7,
                    eventMaxStack: 7,
                    eventClassNames: "day-event-title",
                  },
                }}
                navLinks={true}
                // Custom "read more" link content
                // moreLinkContent={(arg) => {
                //   if (currentView === "dayGridMonth") {
                //     return {
                //       html: `<button class="read-more-btn">📖 See More (${arg.num})</button>`,
                //     };
                //   } else if (currentView === "multiMonthYear" && isDotView) {
                //     const eventCount = arg.num;
                //     // const dotColor = '#3788d8';

                //     if (eventCount === 1) {
                //       return {
                //         html: `<span class="custom-more-events">

                //           <span class="custom-more-text">+ ${eventCount}  </span>
                //          </span>`,
                //       };
                //     } else {
                //       return {
                //         html: `<span class="custom-more-events">

                //           <span class="custom-more-text">+ ${eventCount}  </span>
                //          </span>`,
                //       };
                //     }
                //   } else if (currentView === "timeGridDay") {
                //     const eventCount = arg.num;

                //     if (eventCount === 1) {
                //       return `<span class="custom-more-events">
                //       <span class="custom-more-text">+ ${eventCount} </span>
                //     </span>`;
                //     }
                //   }
                //   return `+ ${arg.num} more`;
                // }}
                // moreLinkClick={handleMoreLinkClick}
                // Custom event count display for year view
                viewDidMount={(info) => {
                  setCurrentView(
                    info.view.type === "multiMonth"
                      ? "multiMonthYear"
                      : info.view.type
                  );
                  if (info.view.type === "multiMonth") {
                    setTimeout(() => {
                      updateMonthTitles();
                      // customizeMoreLinks();
                    }, 100);
                  }

                  // updateToolTip();
                }}
                eventsSet={() => {
                  setTimeout(() => {
                    if (
                      calendarRef.current?.getApi().view.type === "multiMonth"
                    ) {
                      updateMonthTitles();
                      // customizeMoreLinks();
                    }
                  }, 100);

                  // updateToolTip();
                }}
                navLinkDayClick={(date) => {
                  // When clicking on a day number, go to month view of that day
                  handleDateClick(date);
                }}
                navLinkWeekClick={(weekStart) => {
                  // When clicking on a week number, go to month view of that week
                  handleDateClick(weekStart);
                }}
                eventClick={(info) => {
                  // Show event details modal instead of opening new page
                  if (info.event.start) {
                    setSelectedEvent({
                      title: info.event.title,
                      start: info.event.start,
                      end: info.event.end || undefined,
                      userId: info.event.extendedProps.userId || 0,
                      id: info.event.id,
                      color:
                        info.event.backgroundColor || info.event.borderColor,
                      key: info.event.extendedProps.key || "1",
                    });
                    setEventDetailModal(true);
                  }
                }}
                datesSet={updateMonthTitles} // runs on view change
                eventAdd={updateMonthTitles} // runs when new event is added
                eventChange={( ) => {
                  // const dateRange: [dayjs.Dayjs, dayjs.Dayjs] = [
                  //   dayjs(info.event.start),
                  //   dayjs(info.event.end),
                  // ];

                  // const eventSource = calendarRef.current
                  //   ?.getApi()
                  //   .getEventById(info.event.id);
                  // console.log("🚀 ~ eventSource:", eventSource)

                  // const selectedEvent = {
                  //   title: info.event.title,
                  //   start: info.event.start,
                  //   end: info.event.end || undefined,
                  //   userId: info.event.extendedProps.userId || 0,
                  //   id: info.event.id,
                  //   color: info.event.backgroundColor || info.event.borderColor,
                  //   key: info.event.extendedProps.key || "1",
                  // };

                  // checkLimitEvent({
                  //   dateRange,
                  //   selectedEvent,
                  //   eventSource,
                  //   setLimitModalOpen,
                  // });
                }} // runs when event changes
                eventRemove={updateMonthTitles} // runs when event removed
                eventReceive={handleEventReceive}
                // eventDrop={handleEventDrop} // Handle event drag and drop
                eventResize={handleEventResize} // Handle event resize
                drop={(info) => {
                  // Handle external event drop
                  console.log("Dropped event:", info);
                }}
              />
            </div>
          </div>

          <Space style={{ marginTop: 16 }} align="center" wrap>
            <Button
              type="primary"
              onClick={() => {
                saveEventsToLocalStorage(allEvents);
                openNotification();
              }}
            >
              Save to Storage
            </Button>
            <Button onClick={resetEventsToOriginal} danger>
              Reset to Original
            </Button>

            <div style={{ marginLeft: 16, color: "#666" }}>
              Total Events: {allEvents.length} | Filtered: {eventsList.length} |
              Saved: {localStorage.getItem("calendarEvents") ? "Yes" : "No"}
            </div>
          </Space>
        </Col>
      </Row>
    </div>
  );
}
