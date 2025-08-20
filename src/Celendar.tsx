import dayGridPlugin from "@fullcalendar/daygrid";
import multiMonthPlugin from "@fullcalendar/multimonth";
import timeGridPlugin from "@fullcalendar/timegrid";
import FullCalendar from "@fullcalendar/react";
// import interactionPlugin from "@fullcalendar/interaction";
import { useRef, useState } from "react";
import {  Col,  Row,   Tooltip } from "antd";
import dayjs from "dayjs";
import "./Calendar.css"; // Import the CSS file
import UserLists from "./UserLists";
import EventsList from "./EventsList";
import interactionPlugin from "@fullcalendar/interaction";
const events = [
  {
    id: "1",
    title:
      "Team Meeting Now when you're in the Year view and click on any month name  ",
    start: new Date(), // Today
    end: new Date(new Date().getTime() + 2 * 60 * 60 * 1000), // 2 hours from now
    color: "#FFA500",
  },
  {
    id: "2b",
    title:
      "Client Call  it will navigate to that month's detailed view. The navigation uses your existing",
    start: new Date(), // Today - another event same day
    color: "#FFA500",
  },
  {
    id: "extra1",
    title: "Morning Standup",
    start: new Date(), // Today
    color: "#3788d8",
  },
  {
    id: "extra2",
    title: "Project Review",
    start: new Date(), // Today
    color: "#48bb78",
  },
  {
    id: "extra3",
    title: "Design Session",
    start: new Date(), // Today
    color: "#f56565",
  },
  {
    id: "extra4",
    title: "Code Review",
    start: new Date(), // Today
    color: "#ed8936",
  },
  {
    id: "extra5",
    title: "Team Lunch",
    start: new Date(), // Today
    color: "#9f7aea",
  },
  {
    id: "extra6",
    title: "Sprint Planning",
    start: new Date(), // Today
    color: "#38b2ac",
  },
  {
    id: "extra7",
    title: "Sprint Planning 2",
    start: new Date(), // Today
    color: "#38b2ac",
  },
  {
    id: "extra8",
    title: "Sprint Planning 8",
    start: new Date(), // Today
    color: "#38b2ac",
  },
  {
    id: "extra9",
    title: "Sprint Planning 9",
    start: new Date(), // Today
    color: "#38b2ac",
  },
  {
    id: "extra10",
    title: "Sprint Planning 10",
    start: new Date(), // Today
    color: "#38b2ac",
  },
  {
    id: "extra11",
    title: "Sprint Planning 11",
    start: new Date(), // Today
    color: "#38b2ac",
  },
  {
    id: "extra12",
    title: "Sprint Planning 12",
    start: new Date(), // Today
    color: "#38b2ac",
  },
  {
    id: "extra7",
    title: "Client Demo",
    start: dayjs("2025-08-15 08:00").toDate(),
    end: dayjs("2025-08-15 09:00").toDate(),
    color: "#d69e2e",
  },
  {
    id: "extra8",
    title: "Bug Triage",
    start: dayjs("2025-08-15 09:00").toDate(),
    end: dayjs("2025-08-15 10:00").toDate(),
    color: "#e53e3e",
  },

  {
    id: "3",
    title: "Code Review",
    start: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // Tomorrow
    end: new Date(new Date().getTime() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000), // 1 hour
    color: "#FFA500",
  },
  {
    id: "4",
    title: "Weekly Planning",
    start: new Date(new Date().setDate(new Date().getDate() + 2)), // Day after tomorrow
    end: new Date(
      new Date().setDate(new Date().getDate() + 2) + 90 * 60 * 1000
    ), // 1.5 hours
    color: "#FFA500",
  },
  {
    id: "4b",
    title: "Design Review",
    start: new Date(new Date().setDate(new Date().getDate() + 2)), // Day after tomorrow - same day
    color: "#FFA500",
  },
  {
    id: "5",
    title: "Meeting 1",
    start: dayjs("2025-08-11 15:00").toDate(),
    end: dayjs("2025-08-11 16:00").toDate(),
    color: "#FFA500",
  },
  {
    id: "6",
    title: "Meeting 2",
    start: dayjs("2025-08-11 14:00").toDate(),
    end: dayjs("2025-08-11 13:00").toDate(),
    color: "#FFA500",
  },
  {
    id: "7",
    title: "Meeting 3",
    start: dayjs("2025-08-11 13:00").toDate(),
    end: dayjs("2025-08-11 14:00").toDate(),
    color: "#FFA500",
  },
  {
    id: "8",
    title: "Meeting 4",
    start: dayjs("2025-08-11 16:00").toDate(),
    end: dayjs("2025-08-11 16:30").toDate(),
    color: "#FFA500",
  },
  {
    id: "9",
    title: "Meeting 5",
    start: dayjs("2025-08-11 16:30").toDate(),
    end: dayjs("2025-08-11 17:00").toDate(),
    color: "#FFA500",
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
    title: "Meeting 3 xsss weeee  eweewwe www",
    start: dayjs("2025-08-11 11.00").toDate(),
    end: dayjs("2025-08-11 11:15").toDate(),
    color: "blue",
  },
];

export default function Calendar() {
  const calendarRef = useRef<FullCalendar>(null);

  const [isDotView] = useState(true); // New state for dot view toggle
  const [currentView, setCurrentView] = useState("dayGridMonth"); // Track current view
  const [eventsList, setEventsList] = useState(events);
  console.log("🚀 ~ Calendar ~ eventsList:", eventsList.length)
  const [externalEvents, setExternalEvents] = useState([
    {
      key: "event1",
      title: "Events List 1",
    },
    {
      key: "event2",
      title: "Events List 2",
    },
    {
      key: "event3",
      title: "Events List 3",
    },
  ]);

  // const [droppedEventInfo, setDroppedEventInfo] = useState<any>(null);

  // useEffect (() => {

  //   setEventsList (events)

  // } ) , []

  const handleEventReceive = (info: any) => {
    // Check if the event has time information from the dragged button
    const timeSlot = info.event.extendedProps?.timeSlot;
    const startTime = info.event.extendedProps?.startTime;
    const endTime = info.event.extendedProps?.endTime;
    
    if (timeSlot && startTime && endTime) {
      // Automatically create event with the predefined time
      const eventDate = info.event.start;
      const startDate = new Date(eventDate);
      const [startHour, startMinute] = startTime.split(':').map(Number);
      startDate.setHours(startHour, startMinute, 0, 0);
      
      const endDate = new Date(eventDate);
      const [endHour, endMinute] = endTime.split(':').map(Number);
      endDate.setHours(endHour, endMinute, 0, 0);
      
      const color = timeSlot === 'morning' ? 'green' : 'blue';
      
      const newEvent = {
        id: `event-${Date.now()}`,
        title: info.event.title,
        start: startDate,
        end: endDate,
        color: color,
      };
      

      // check Duplicate 

      const newList = eventsList.filter((event) => event.title !== newEvent.title);
      // Add to events list
      setEventsList(  [...newList, newEvent]);
      
      // Extract the original event title to remove from external list
      // The title format is "EventTitle - Morning" or "EventTitle - Afternoon"
      const titleParts = info.event.title.split(' - ');
      const originalEventTitle = titleParts[0]; // Get the first part before " - "
      
      // Remove from external events by matching the original title
      setExternalEvents((prevEvents) =>
        prevEvents.filter((event) => event.title !== originalEventTitle)
      );
    }
    
    // Remove the temporary event that FullCalendar creates
    info.event.remove();
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
        console.log("🚀 ~ updateMonthTitles ~ key:", key)
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

  return (
    <div>
      {/* {ModalConfirm}{" "} */}
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <EventsList events={externalEvents} />
          <UserLists />
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
                  // link to new page
                  window.open(info.event.url, "_blank");
                }}
                datesSet={updateMonthTitles} // runs on view change
                eventAdd={updateMonthTitles} // runs when new event is added
                eventChange={updateMonthTitles} // runs when event changes
                eventRemove={updateMonthTitles} // runs when event removed
                eventReceive={handleEventReceive}
                drop={(info) => {
                  // Handle external event drop
                  console.log("Dropped event:", info);
                }}

              />
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}
