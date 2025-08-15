import dayGridPlugin from "@fullcalendar/daygrid";
import multiMonthPlugin from "@fullcalendar/multimonth";
import timeGridPlugin from "@fullcalendar/timegrid";
import FullCalendar from "@fullcalendar/react";
import type { EventApi, EventClickArg } from "@fullcalendar/core";
import { useRef, useState } from "react";
import { Modal, Typography, Tag, Space, Tooltip } from "antd";
import { CalendarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const events = [
  {
    id: "1",
    title: "Team Meeting",
    start: new Date(), // Today
    end: new Date(new Date().getTime() + 2 * 60 * 60 * 1000), // 2 hours from now
    color: "#9f7aea",
  },
 
  {
    id: "2b",
    title: "Client Call",
    start: new Date(), // Today - another event same day
    color: "#9f7aea",
  },
  {
    id: "3",
    title: "Code Review",
    start: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // Tomorrow
    end: new Date(new Date().getTime() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000), // 1 hour
    color: "#9f7aea",
  },
  {
    id: "4",
    title: "Weekly Planning",
    start: new Date(new Date().setDate(new Date().getDate() + 2)), // Day after tomorrow
    end: new Date(
      new Date().setDate(new Date().getDate() + 2) + 90 * 60 * 1000
    ), // 1.5 hours
    color: "#9f7aea",
  },
  {
    id: "4b",
    title: "Design Review",
    start: new Date(new Date().setDate(new Date().getDate() + 2)), // Day after tomorrow - same day
    color: "#9f7aea",
  },
  {
    id: "5",
    title: "Meeting 1",
    start: dayjs("2025-08-11 15:00").toDate(),
    end: dayjs("2025-08-11 16:00").toDate(),
    color: "#9f7aea",
  },
  {
    id: "6",
    title: "Meeting 2",
    start: dayjs("2025-08-11 14:00").toDate(),
    end: dayjs("2025-08-11 13:00").toDate(),
    color: "#9f7aea",
  },
    {
    id: "7",
    title: "Meeting 3",
    start: dayjs("2025-08-11 13:00").toDate(),
    end: dayjs("2025-08-11 14:00").toDate(),
    color: "#9f7aea",
  },
   {
    id: "8",
    title: "Meeting 4",
    start: dayjs("2025-08-11 16:00").toDate(),
    end: dayjs("2025-08-11 16:30").toDate(),
    color: "#9f7aea",
  },
  {
    id: "9",
    title: "Meeting 5",
    start: dayjs("2025-08-11 16:30").toDate(),
    end: dayjs("2025-08-11 17:00").toDate(),
    color: "#9f7aea",
  },


    {
    id: "10",
    title: "Meeting 1",
    start: dayjs("2025-08-11 8:30").toDate(),
    end: dayjs("2025-08-11 9:00").toDate(),
    color: "blue",
  },
    {
    id: "11",
    title: "Meeting 2",
    start: dayjs("2025-08-11 9.00").toDate(),
    end: dayjs("2025-08-11 11:00").toDate(),
    color: "blue",
  },
    {
    id: "12",
    title: "Meeting 3",
    start: dayjs("2025-08-11 11.00").toDate(),
    end: dayjs("2025-08-11 11:15").toDate(),
    color: "blue",
  },
];

export default function Calendar() {
  const calendarRef = useRef<FullCalendar>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventApi | null>(null);
  const [isDotView] = useState(true); // New state for dot view toggle
  const [currentView, setCurrentView] = useState("dayGridMonth"); // Track current view

  const updateMonthTitles = () => {
    const calendarApi = calendarRef.current && calendarRef.current.getApi();
    const allEvents = calendarApi ? calendarApi.getEvents() : [];

    // Count events per month/year
    const monthEventCounts: { [key: string]: number } = {};
    allEvents.forEach((evt) => {
      const date = evt.start;
      const key = `${date && date.getFullYear()}-${
        date && date.getMonth() + 1
      }`;
      monthEventCounts[key] = (monthEventCounts[key] || 0) + 1;
    });

    // Update the month header labels
    document.querySelectorAll(".fc-multimonth-title").forEach((titleEl) => {
      const match = titleEl.textContent.match(/^([A-Za-z]+)\s?(\d{4})?$/);

      if (match) {
        const monthName = match[1];
        const year = match[2] || new Date().getFullYear();
        const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth() + 1;
        const key = `${year}-${monthIndex}`;
        const count = monthEventCounts[key] || 0;

        // remove old data

        titleEl.innerHTML = `<span> <span class="event-count">(${count})</span></span>`;
      }
    });

    //  make  <a></a> link wrapper  .fc-multimonth-title

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

  const handleDateClick = (date: Date) => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.changeView("dayGridMonth", date);
    }
  };

  const handleEventClick = (info: EventClickArg) => {
    setSelectedEvent(info.event);
    setModalVisible(true);
  };

  // Function to get the color of events for a specific date
  const getEventColorForDate = (date: Date) => {
    const calendarApi = calendarRef.current?.getApi();
    if (!calendarApi) return "#3788d8";

    const apiEvents = calendarApi.getEvents();
    const dayStart = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    const dayEnd = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      23,
      59,
      59
    );

    // Find events on this specific day
    const dayEvents = apiEvents.filter((event) => {
      const eventStart = event.start;
      const eventEnd = event.end || event.start;
      if (!eventStart) return false;

      return eventStart <= dayEnd && (!eventEnd || eventEnd >= dayStart);
    });

    // Try to get color from various sources
    if (dayEvents.length > 0) {
      const firstEvent = dayEvents[0];
      return (
        firstEvent.backgroundColor ||
        firstEvent.borderColor ||
        firstEvent.extendedProps?.color ||
        // Fallback to original events array
        events.find((e) => e.id === firstEvent.id)?.color ||
        "#3788d8"
      );
    }

    return "#3788d8";
  };

  // Function to customize more links after calendar render
  const customizeMoreLinks = () => {
    if (currentView !== "multiMonthYear") return;

    setTimeout(() => {
      const moreLinks = document.querySelectorAll(
        ".fc-multimonth .fc-more-link"
      );

      moreLinks.forEach((link) => {
        const linkElement = link as HTMLElement;
        const text = linkElement.textContent || "";
        const match = text.match(/\+ (\d+) more/);

        if (match) {
          const count = parseInt(match[1]);

          // Get the date from the parent day cell
          const dayCell = linkElement.closest(".fc-daygrid-day");
          if (!dayCell) return;

          const dateStr = dayCell.getAttribute("data-date");
          if (!dateStr) return;

          const date = new Date(dateStr + "T00:00:00");
          const eventColor = getEventColorForDate(date);

          if (count === 1) {
            // Single event: show just a colored dot
            linkElement.innerHTML = `<span class="custom-single-event-dot" style="background-color: ${eventColor}"></span>`;
          } else {
            // Multiple events: show dot with text
            linkElement.innerHTML = `
              <span class="custom-more-events">
                <span class="custom-more-dot" style="background-color: ${eventColor}"></span>
                <span class="custom-more-text">+ ${count} more</span>
              </span>
            `;
          }
        }
      });
    }, 200);
  };

  // const updateMonthTitlesWithEventCounts = () => {
  //   const calendarApi = calendarRef.current?.getApi();
  //   if (!calendarApi) return;

  //   // Get all events
  //   const allEvents = calendarApi.getEvents();

  //   // Find all month title elements in the year view
  //   const monthTitles = document.querySelectorAll(".fc-multimonth-title");

  //   monthTitles.forEach((titleElement) => {
  //     const titleText = titleElement.textContent || "";

  //     // Extract month name (remove any existing count)
  //     const monthName = titleText.replace(/\s*\(\d+\)$/, "");

  //     // Get the month element to find its date range
  //     const monthElement = titleElement.closest(".fc-multimonth-month");
  //     if (!monthElement) return;

  //     // Get the month's date range
  //     const monthDateStr = monthElement.getAttribute("data-date");
  //     if (!monthDateStr) return;

  //     const monthDate = new Date(monthDateStr + "T00:00:00");
  //     const monthStart = new Date(
  //       monthDate.getFullYear(),
  //       monthDate.getMonth(),
  //       1
  //     );
  //     const monthEnd = new Date(
  //       monthDate.getFullYear(),
  //       monthDate.getMonth() + 1,
  //       0,
  //       23,
  //       59,
  //       59
  //     );

  //     // Count events in this month
  //     const eventsInMonth = allEvents.filter((event) => {
  //       const eventStart = event.start;
  //       const eventEnd = event.end || event.start;

  //       if (!eventStart || !eventEnd) return false;

  //       // Check if event overlaps with this month
  //       return eventStart <= monthEnd && eventEnd >= monthStart;
  //     });

  //     // Update title with count
  //     const eventCount = eventsInMonth.length;
  //     titleElement.textContent = `${monthName} (${eventCount})`;
  //   });
  // };

  // Sample events including today

  return (
    <div>
      {/* Toggle button for year view */}
      {currentView === "multiMonthYear" && (
        <div style={{ marginBottom: 16, textAlign: "right" }}>
          <Tooltip
            title={
              isDotView
                ? "Switch to show full event titles"
                : "Switch to show events as dots"
            }
          ></Tooltip>
        </div>
      )}

      {/* Custom styles for year view dots */}
      <style>{`
        /* Enhance dot display in year view */
        .fc-multimonth .fc-event-main {
          padding: 0;
        }
        
        .fc-multimonth .fc-daygrid-dot-event {
          margin: 1px;
          border-radius: 50%;
          width: 8px;
          height: 8px;
          display: inline-block;
        }
        
        .fc-multimonth .fc-daygrid-dot-event:hover {
          transform: scale(1.2);
          cursor: pointer;
        }
        
        /* Style the dots container */
        .fc-multimonth .fc-daygrid-event-harness {
          margin: 0 1px;
        }
        
        /* Month title link styling */
        .fc-multimonth-title a {
          color: inherit;
          text-decoration: none;
          display: block;
          padding: 4px 8px;
          border-radius: 4px;
          transition: background-color 0.2s ease;
        }
        
        .fc-multimonth-title a:hover {
          background-color: rgba(56, 136, 216, 0.1);
          color: #3788d8;
        }
        
        /* Custom single event dot styling */
        .custom-single-event-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          display: inline-block;
          margin: 2px;
          cursor: pointer;
          transition: transform 0.2s ease;
        }
        
        .custom-single-event-dot:hover {
          transform: scale(1.3);
        }
        
        /* Custom multiple events styling */
        .custom-more-events {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          padding: 1px 4px;
          border-radius: 10px;
          background-color: rgba(0, 0, 0, 0.05);
          transition: background-color 0.2s ease;
        }
        
        .custom-more-events:hover {
          background-color: rgba(0, 0, 0, 0.1);
        }
        
        .custom-more-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          display: inline-block;
          flex-shrink: 0;
        }
        
        .custom-more-text {
          font-size: 10px;
          color: #666;
          white-space: nowrap;
          font-weight: 500;
        }
        
        /* More events link styling */
        .fc-multimonth .fc-more-link {
          font-size: 11px;
          color: #666;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
        }
        
        .fc-multimonth .fc-more-link:hover {
          color: #1890ff;
          text-decoration: none;
        }
      `}</style>

      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, multiMonthPlugin, timeGridPlugin]}
        initialView="dayGridMonth"
        events={events}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,multiMonthYear",
        }}
        // customButtons={{
        //   dotToggle: {
        //     text: isDotView ? "Show Titles" : "Show Dots",
        //     click: () => setIsDotView(!isDotView),
        //   },
        // }}
        views={{
          multiMonthYear: {
            type: "multiMonth",
            duration: { years: 1 },
            buttonText: "Year",

            // dayCount: 365,
            multiMonthTitleFormat: {
              month: "long",
            },

            // Display events as dots in year view based on toggle
            eventDisplay: isDotView ? "dot" : "block",
            dayMaxEvents: isDotView ? 1 : 2, // Show max 1 dot then "+more" for better control
          },
          timeGridWeek: {
            type: "timeGrid",
            duration: { weeks: 1 },
            buttonText: "Week",
            slotMinTime: "06:00:00",
            slotMaxTime: "22:00:00",
            allDaySlot: true,
          },
        }}
        height="auto"
        navLinks={true}
        // Custom event count display for year view
        viewDidMount={(info) => {
          setCurrentView(
            info.view.type === "multiMonth" ? "multiMonthYear" : info.view.type
          );
          if (info.view.type === "multiMonth") {
            setTimeout(() => {
              // updateMonthTitlesWithEventCounts();
              customizeMoreLinks();
            }, 100);
          }
        }}
        eventsSet={() => {
          // Update counts when events change
          setTimeout(() => {
            if (calendarRef.current?.getApi().view.type === "multiMonth") {
              // updateMonthTitlesWithEventCounts();
              customizeMoreLinks();
            }
          }, 100);
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
          handleEventClick(info);
        }}
        datesSet={updateMonthTitles} // runs on view change
        eventAdd={updateMonthTitles} // runs when new event is added
        eventChange={updateMonthTitles} // runs when event changes
        eventRemove={updateMonthTitles} // runs when event removed
      />
      {/*  modal  */}
      <Modal
        title={
          <Space>
            <CalendarOutlined />
            <Title level={4} style={{ margin: 0 }}>
              Event Details
            </Title>
          </Space>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={500}
      >
        {selectedEvent && (
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <div>
              <Text strong>Event Title:</Text>
              <br />
              <Title
                level={3}
                style={{
                  margin: "8px 0",
                  color: selectedEvent.backgroundColor,
                }}
              >
                {selectedEvent.title}
              </Title>
            </div>

            <div>
              <Text strong>
                <ClockCircleOutlined /> Date & Time:
              </Text>
              <br />
              <Text>
                {selectedEvent.allDay
                  ? `All Day - ${selectedEvent.start?.toLocaleDateString()}`
                  : `${selectedEvent.start?.toLocaleString()} - ${selectedEvent.end?.toLocaleString()}`}
              </Text>
            </div>

            <div>
              <Text strong>Event Type:</Text>
              <br />
              <Tag
                color={selectedEvent.backgroundColor}
                style={{ marginTop: 4 }}
              >
                {selectedEvent.allDay ? "All Day Event" : "Timed Event"}
              </Tag>
            </div>

            {selectedEvent.extendedProps && (
              <div>
                <Text strong>Additional Info:</Text>
                <br />
                <Text type="secondary">Event ID: {selectedEvent.id}</Text>
              </div>
            )}
          </Space>
        )}
      </Modal>
    </div>
  );
}
