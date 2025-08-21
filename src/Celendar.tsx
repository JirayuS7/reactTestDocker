import dayGridPlugin from "@fullcalendar/daygrid";
import multiMonthPlugin from "@fullcalendar/multimonth";
import timeGridPlugin from "@fullcalendar/timegrid";
import FullCalendar from "@fullcalendar/react";
import { CheckCircleOutlined   } from '@ant-design/icons';
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
import EventsList from "./EventsList";
import interactionPlugin from "@fullcalendar/interaction";

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end?: Date;
  color?: string;
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
}

const events: CalendarEvent[] = [
  {
    id: "1",
    title:
      "Team Meeting Now when you're in the Year view and click on any month name  ",
    start: new Date(), // Today
    end: new Date(new Date().getTime() + 2 * 60 * 60 * 1000), // 2 hours from now
    color: "#FFA500",
    key: "1",
  },
  {
    id: "2b",
    title:
      "Client Call  it will navigate to that month's detailed view. The navigation uses your existing",
    start: new Date(), // Today - another event same day
    color: "#FFA500",
    key: "1",
  },
  {
    id: "extra1",
    title: "Morning Standup",
    start: new Date(), // Today
    color: "#3788d8",
    key: "2",
  },
  {
    id: "extra2",
    title: "Project Review",
    start: new Date(), // Today
    color: "#48bb78",
    key: "2",
  },
  {
    id: "extra3",
    title: "Design Session",
    start: new Date(), // Today
    color: "#f56565",
    key: "2",
  },
  {
    id: "extra4",
    title: "Code Review",
    start: new Date(), // Today
    color: "#ed8936",
    key: "2",
  },
  {
    id: "extra5",
    title: "Team Lunch",
    start: new Date(), // Today
    color: "#9f7aea",
    key: "2",
  },
  {
    id: "extra6",
    title: "Sprint Planning",
    start: new Date(), // Today
    color: "#38b2ac",
    key: "3",
  },
  {
    id: "extra7",
    title: "Sprint Planning 2",
    start: new Date(), // Today
    color: "#38b2ac",
    key: "3",
  },
  {
    id: "extra8",
    title: "Sprint Planning 8",
    start: new Date(), // Today
    color: "#38b2ac",
    key: "3",
  },
  {
    id: "extra9",
    title: "Sprint Planning 9",
    start: new Date(), // Today
    color: "#38b2ac",
    key: "3",
  },
  {
    id: "extra10",
    title: "Sprint Planning 10",
    start: new Date(), // Today
    color: "#38b2ac",
    key: "3",
  },
  {
    id: "extra11",
    title: "Sprint Planning 11",
    start: new Date(), // Today
    color: "#38b2ac",
    key: "3",
  },
  {
    id: "extra12",
    title: "Sprint Planning 12",
    start: new Date(), // Today
    color: "#38b2ac",
    key: "4",
  },
  {
    id: "extra7",
    title: "Client Demo",
    start: dayjs("2025-08-15 08:00").toDate(),
    end: dayjs("2025-08-15 09:00").toDate(),
    color: "#d69e2e",
    key: "4",
  },
  {
    id: "extra8",
    title: "Bug Triage",
    start: dayjs("2025-08-15 09:00").toDate(),
    end: dayjs("2025-08-15 10:00").toDate(),
    color: "#e53e3e",
    key: "4",
  },

  {
    id: "3",
    title: "Code Review",
    start: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // Tomorrow
    end: new Date(new Date().getTime() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000), // 1 hour
    color: "#FFA500",
    key: "4",
  },
  {
    id: "4",
    title: "Weekly Planning",
    start: new Date(new Date().setDate(new Date().getDate() + 2)), // Day after tomorrow
    end: new Date(
      new Date().setDate(new Date().getDate() + 2) + 90 * 60 * 1000
    ), // 1.5 hours
    color: "#FFA500",
    key: "4",
  },
  {
    id: "4b",
    title: "Design Review",
    start: new Date(new Date().setDate(new Date().getDate() + 2)), // Day after tomorrow - same day
    color: "#FFA500",
    key: "4",
  },
  {
    id: "5",
    title: "Meeting 1",
    start: dayjs("2025-08-11 15:00").toDate(),
    end: dayjs("2025-08-11 16:00").toDate(),
    color: "#FFA500",
    key: "4",
  },
  {
    id: "6",
    title: "Meeting 2",
    start: dayjs("2025-08-11 14:00").toDate(),
    end: dayjs("2025-08-11 13:00").toDate(),
    color: "#FFA500",
    key: "4",
  },
  {
    id: "7",
    title: "Meeting 3",
    start: dayjs("2025-08-11 13:00").toDate(),
    end: dayjs("2025-08-11 14:00").toDate(),
    color: "#FFA500",
    key: "4",
  },
  {
    id: "8",
    title: "Meeting 4",
    start: dayjs("2025-08-11 16:00").toDate(),
    end: dayjs("2025-08-11 16:30").toDate(),
    color: "#FFA500",
    key: "4",
  },
  {
    id: "9",
    title: "Meeting 5",
    start: dayjs("2025-08-11 16:30").toDate(),
    end: dayjs("2025-08-11 17:00").toDate(),
    color: "#FFA500",
    key: "3",
  },

  {
    id: "10",
    title: "Meeting 1",
    start: dayjs("2025-08-11 8:30").toDate(),
    end: dayjs("2025-08-11 9:00").toDate(),
    color: "blue",
    key: "3",
  },
  {
    id: "11",
    title: "Meeting 2",
    start: dayjs("2025-08-11 9.00").toDate(),
    end: dayjs("2025-08-11 11:00").toDate(),
    color: "blue",
    key: "3",
  },
  {
    id: "12",
    title: "Meeting 3 xsss weeee  eweewwe www",
    start: dayjs("2025-08-11 11.00").toDate(),
    end: dayjs("2025-08-11 11:15").toDate(),
    color: "blue",
    key: "3",
  },
];

export default function Calendar() {
  const calendarRef = useRef<FullCalendar>(null);

  const [isDotView] = useState(true); // New state for dot view toggle
  const [currentView, setCurrentView] = useState("dayGridMonth"); // Track current view

  // Store the original/full events list separately from filtered view
  const [allEvents, setAllEvents] = useState(() => {
    const savedEvents = localStorage.getItem('calendarEvents');
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
        console.error('Error parsing saved events:', error);
        return events;
      }
    }
    return events;
  });

  // Filtered events for display (based on selected user)
  const [eventsList, setEventsList] = useState(() => {
    const savedEvents = localStorage.getItem('calendarEvents');
    if (savedEvents) {
      try {
        const parsedEvents = JSON.parse(savedEvents);
    
        return parsedEvents.map((event: CalendarEvent) => ({
          ...event,
          start: new Date(event.start),
          end: event.end ? new Date(event.end) : undefined,
        }));
      } catch (error) {
        console.error('Error parsing saved events:', error);
        return events;
      }
    }
    return events;
  });

  const [userEvents] = useState([
    {
      key: "1",
      title: "Alex bot Brown",
    },
    {
      key: "2",
      title: "Samantha Brown",
    },
    {
      key: "3",
      title: "Desmond Brown",
    },

    {
      key: "4",
      title: "Charlie Brown",
    },
  ]);

  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [eventDetailModal, setEventDetailModal] = useState(false);
  const [eventEditModal, setEventEditModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<{
    title: string;
    start: Date;
    end?: Date;
    id: string;
    color?: string;
    key?: string;
  } | null>(null);
  const [editingEvent, setEditingEvent] = useState<{
    title: string;
    start: Date;
    end?: Date;
    id: string;
    color?: string;
    key?: string;
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
    if (allEvents !== events) { // Only save if events have been modified
      saveEventsToLocalStorage(allEvents);
    }
  }, [allEvents, saveEventsToLocalStorage]);

  // const [droppedEventInfo, setDroppedEventInfo] = useState<any>(null);

  // useEffect (() => {

  //   setEventsList (events)

  // } ) , []

  const handleEventReceive = (info: FullCalendarEventInfo) => {
    // Check if the event has time information from the dragged button
    const timeSlot = info.event.extendedProps?.timeSlot;
    const startTime = info.event.extendedProps?.startTime;
    const endTime = info.event.extendedProps?.endTime;

    if (timeSlot && startTime && endTime && info.event.start) {
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
        key: "1", // Default key for dropped events
      };

      // check Duplicate
      interface CalendarEvent {
        id: string;
        title: string;
        start: Date;
        end?: Date;
        color?: string;
        key?: string;
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
          (event) => event.key === selectedUser
        );
        setEventsList(filteredEvents);
      } else {
        setEventsList(updatedAllEvents);
      }

      // Extract the original event title to remove from external list
      // The title format is "EventTitle - Morning" or "EventTitle - Afternoon"
      // const titleParts = info.event.title.split(' - ');
      // const originalEventTitle = titleParts[0]; // Get the first part before " - "

      // Remove from external events by matching the original title
      // setExternalEvents((prevEvents) =>
      //   prevEvents.filter((event) => event.title !== originalEventTitle)
      // );
    }

    // Remove the temporary event that FullCalendar creates
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
      }

      const selectedUserEvents: CalendarEvent[] = allEvents.filter(
        (item: CalendarEvent) => item.key === selectedUser
      );
      setEventsList(selectedUserEvents);
    } else {
      setEventsList(allEvents);
    }
  }, [selectedUser, allEvents]);

  // Handle event drag and drop to change dates
  const handleEventDrop = (info: FullCalendarEventInfo) => {
    if (!info.event.start) return;
    
    const updatedEvent: CalendarEvent = {
      id: info.event.id,
      title: info.event.title,
      start: info.event.start,
      end: info.event.end || undefined,
      color: info.event.backgroundColor || info.event.borderColor || "#3788d8",
      key: info.event.extendedProps.key || "1",
    };

    // Update allEvents
    const updatedAllEvents = allEvents.map((event:CalendarEvent) =>
      event.id === updatedEvent.id ? updatedEvent : event
    );
    setAllEvents(updatedAllEvents);

    // Update filtered events
    setEventsList((prevEvents: CalendarEvent[]) =>
      prevEvents.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );

    message.success(
      `Event "${info.event.title}" moved to ${dayjs(info.event.start).format(
        "YYYY-MM-DD HH:mm"
      )}`
    );
  };

  // Handle event resize to change duration
  const handleEventResize = (info: FullCalendarEventInfo) => {
    if (!info.event.start) return;
    
    const updatedEvent: CalendarEvent = {
      id: info.event.id,
      title: info.event.title,
      start: info.event.start,
      end: info.event.end || undefined,
      color: info.event.backgroundColor || info.event.borderColor || "#3788d8",
      key: info.event.extendedProps.key || "1",
    };

    // Update allEvents
    const updatedAllEvents = allEvents.map((event:CalendarEvent) =>
      event.id === updatedEvent.id ? updatedEvent : event
    );
    setAllEvents(updatedAllEvents);

    // Update filtered events
    setEventsList((prevEvents :CalendarEvent[] ) =>
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
      key: editingEvent.key || "1",
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

  // Function to get the color of events for a specific date

  // Function to customize more links after calendar render
  // const customizeMoreLinks = () => {
  //   if (currentView !== "multiMonthYear") return;

  //   setTimeout(() => {
  //     const moreLinks = document.querySelectorAll(
  //       ".fc-multimonth .fc-more-link"
  //     );

  //     moreLinks.forEach((link) => {
  //       const linkElement = link as HTMLElement;
  //       const text = linkElement.textContent || "";
  //       const match = text.match(/\+ (\d+) more/);

  //       if (match) {
  //         const count = parseInt(match[1]);

  //         // Get the date from the parent day cell
  //         const dayCell = linkElement.closest(".fc-daygrid-day");
  //         if (!dayCell) return;

  //         const dateStr = dayCell.getAttribute("data-date");
  //         if (!dateStr) return;

  //         // const date = new Date(dateStr + "T00:00:00");
  //         // const eventColor = getEventColorForDate(date);

  //         if (count === 1) {
  //           // Single event: show just a colored dot
  //           // linkElement.innerHTML = `<span class="custom-single-event-dot" style="background-color: ${eventColor}"></span>`;
  //           linkElement.innerHTML = `   <span class="custom-more-events">

  //               <span class="custom-more-text">+ ${count} more</span>
  //             </span>`;
  //         } else {
  //           // Multiple events: show dot with text
  //           linkElement.innerHTML = `
  //             <span class="custom-more-events">

  //               <span class="custom-more-text">+ ${count} more</span>
  //             </span>
  //           `;
  //         }
  //       }
  //     });
  //   }, 200);
  // };

  //  confirm drop
  // const [isModalOpen, setIsModalOpen] = useState(false);

  // const showModal = () => {
  //   setIsModalOpen(true);
  // };

  // const handleOk = () => {
  //   setIsModalOpen(false);
  // };

  // const handleCancel = () => {
  //   setIsModalOpen(false);
  // };

  // const [form] = Form.useForm();
  // const [formLayout, setFormLayout] = useState<LayoutType>("horizontal");

  // const onFormLayoutChange = ({ layout }: { layout: LayoutType }) => {
  //   setFormLayout(layout);
  // };

  // const ModalConfirm = (
  //   <Modal
  //     title={`Select Event Duration  at ${
  //       dayjs(droppedEventInfo?.dateStr).format("YYYY-MM-DD") || "-"
  //     }`}
  //     closable={{ "aria-label": "Custom Close Button" }}
  //     open={isModalOpen}
  //     footer={null}
  //     centered
  //     onCancel={handleCancel}
  //   >
  //     <Form
  //       layout={formLayout}
  //       form={form}
  //       initialValues={{ layout: formLayout }}
  //       onValuesChange={onFormLayoutChange}
  //       style={{ maxWidth: formLayout === "inline" ? "none" : 600 }}
  //     >
  //       <Form.Item name="layout">
  //         <Space direction="vertical" style={{ width: "100%" }}>
  //           <Button
  //             color="cyan"
  //             variant="solid"
  //             onClick={() => handleTimeSelection(6, 12)}
  //           >
  //             Morning Time : 06:00 - 12:00
  //           </Button>
  //           <Button
  //             color="primary"
  //             variant="solid"
  //             onClick={() => handleTimeSelection(12, 18)}
  //           >
  //             Afternoon Time : 12:00 - 18:00
  //           </Button>
  //         </Space>
  //       </Form.Item>
  //     </Form>
  //   </Modal>
  // );

  //  tool tip

  // Copy from FullCalendar source for default inner structure
  // function renderInnerContent(innerProps: any) {

  //   const limitText = 20;
  //   const eventTitle = innerProps.event.title || "\u00A0";
  //   const displayedTitle =
  //     eventTitle.length > limitText
  //       ? eventTitle.slice(0, limitText) + "..."
  //       : eventTitle;

  //   if (currentView === "dayGridMonth") {
  //     // Custom rendering for multiMonthYear view

  //     return (
  //       <div className="fc-event-main-frame">
  //         {innerProps.timeText && (
  //           <div className="fc-event-time">
  //             {" "}
  //             <span
  //               style={{
  //                 width: "8px",
  //                 height: "8px",
  //                 display: "inline-block",
  //                 backgroundColor: innerProps.event.backgroundColor,
  //               }}
  //             >
  //               {" "}
  //             </span>{" "}
  //             {innerProps.timeText} : {displayedTitle}
  //           </div>
  //         )}
  //         {/* <div className="fc-event-title-container">
  //           <div className="fc-event-title fc-sticky">{displayedTitle}</div>
  //         </div> */}
  //       </div>
  //     );
  //   }
  // }
  // const renderEventWithTooltip = (arg: any) => {
  //   return renderInnerContent(arg);
  // };

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
            {userEvents.find((user) => user.key === selectedEvent.key)?.title ||
              "All Users"}
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
        </Space>
      )}
    </Modal>
  );


   const [api, contextHolder] = notification.useNotification();

  const openNotification = () => {
    api.open({
      message: 'Saved Successfully',

      icon: (
        <>
        
          <CheckCircleOutlined style={{ color: '#52c41a', marginLeft: 8 }} />
        </>
      ),
    });
  };


  return (
    <div>
       {contextHolder}
      {EditEventModal}
      {EventDetailModal}
      {/* {ModalConfirm}{" "} */}
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <EventsList
            events={userEvents}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
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
                eventChange={updateMonthTitles} // runs when event changes
                eventRemove={updateMonthTitles} // runs when event removed
                eventReceive={handleEventReceive}
                eventDrop={handleEventDrop} // Handle event drag and drop
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
              Total Events: {allEvents.length} | Filtered: {eventsList.length} | Saved:{" "}
              {localStorage.getItem("calendarEvents") ? "Yes" : "No"}
            </div>
          </Space>
        </Col>
      </Row>
    </div>
  );
}
