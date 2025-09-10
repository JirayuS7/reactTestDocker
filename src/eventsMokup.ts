import dayjs from "dayjs";
import type { CalendarEvent } from "./Celendar";

const events: CalendarEvent[] = [
  {
    id: "1",
    title:
      "Team Meeting Now when you're in the Year view and click on any month name  ",
    start: new Date(), // Today
    end: new Date(new Date().getTime() + 2 * 60 * 60 * 1000), // 2 hours from now
    color: "#FFA500",
    userId: 1,
    status: "Success",
  },
  {
    id: "2b",
    title:
      "Client Call  it will navigate to that month's detailed view. The navigation uses your existing",
    start: new Date(), // Today - another event same day
    color: "#FFA500",
    userId: 1,
    status: "Success",
  },
  {
    id: "extra1",
    title: "Morning Standup",
    start: new Date(), // Today
    color: "#3788d8",
    userId: 2,
    status: "Success",
  },
  {
    id: "extra2",
    title: "Project Review",
    start: new Date(), // Today
    color: "#48bb78",
    userId: 2,
    status: "Cancelled",
    
  },
  {
    id: "extra3",
    title: "Design Session",
    start: new Date(), // Today
    color: "#f56565",
    userId: 2,
    status: "Success",
  },
  {
    id: "extra4",
    title: "Code Review",
    start: new Date(), // Today
    color: "#ed8936",
    userId: 2,
    status: "Pending",
  },
  {
    id: "extra5",
    title: "Team Lunch",
    start: new Date(), // Today
    color: "#9f7aea",
    userId: 2,
    status: "Pending",
  },
  {
    id: "extra6",
    title: "Sprint Planning",
    start: new Date(), // Today
    color: "#38b2ac",
    userId: 3,
    status: "Pending",
  },
  {
    id: "extra7",
    title: "Sprint Planning 2",
    start: new Date(), // Today
    color: "#38b2ac",
    userId: 3,
    status: "Pending",
  },
  {
    id: "extra8",
    title: "Sprint Planning 8",
    start: new Date(), // Today
    color: "#38b2ac",
    userId: 3,
    status: "Pending",
  },
  {
    id: "extra9",
    title: "Sprint Planning 9",
    start: new Date(), // Today
    color: "#38b2ac",
    userId: 3,
    status: "Pending",
  },
  {
    id: "extra10",
    title: "Sprint Planning 10",
    start: new Date(), // Today
    color: "#38b2ac",
    userId: 3,
    status: "Pending",
  },
  {
    id: "extra11",
    title: "Sprint Planning 11",
    start: new Date(), // Today
    color: "#38b2ac",
    userId: 3,
    status: "Pending",
  },
  {
    id: "extra12",
    title: "Sprint Planning 12",
    start: new Date(), // Today
    color: "#38b2ac",
    userId: 4,
    status: "Pending",
  },
  {
    id: "extra7",
    title: "Client Demo",
    start: dayjs("2025-08-15 08:00").toDate(),
    end: dayjs("2025-08-15 09:00").toDate(),
    color: "#d69e2e",
    userId: 4,
    status: "Pending",
  },
  {
    id: "extra8",
    title: "Bug Triage",
    start: dayjs("2025-08-15 09:00").toDate(),
    end: dayjs("2025-08-15 10:00").toDate(),
    color: "#e53e3e",
    userId: 4,
    status: "Pending",
  },

  {
    id: "3",
    title: "Code Review",
    start: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // Tomorrow
    end: new Date(new Date().getTime() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000), // 1 hour
    color: "#FFA500",
    userId: 4,
    status: "Pending",
  },
  {
    id: "4",
    title: "Weekly Planning",
    start: new Date(new Date().setDate(new Date().getDate() + 2)), // Day after tomorrow
    end: new Date(
      new Date().setDate(new Date().getDate() + 2) + 90 * 60 * 1000
    ), // 1.5 hours
    color: "#FFA500",
    userId: 4,
    status: "Pending",
  },
  {
    id: "4b",
    title: "Design Review",
    start: new Date(new Date().setDate(new Date().getDate() + 2)), // Day after tomorrow - same day
    color: "#FFA500",
    userId: 4,
    status: "Pending",  
  },
  {
    id: "5",
    title: "Meeting 1",
    start: dayjs("2025-08-11 15:00").toDate(),
    end: dayjs("2025-08-11 16:00").toDate(),
    color: "#FFA500",
    userId: 4,
    status: "Pending",
  },
  {
    id: "6",
    title: "Meeting 2",
    start: dayjs("2025-08-11 14:00").toDate(),
    end: dayjs("2025-08-11 13:00").toDate(),
    color: "#FFA500",
    userId: 4,
    status: "Pending",
  },
  {
    id: "7",
    title: "Meeting 3",
    start: dayjs("2025-08-11 13:00").toDate(),
    end: dayjs("2025-08-11 14:00").toDate(),
    color: "#FFA500",
    userId: 4,
    status: "Pending",
  },
  {
    id: "8",
    title: "Meeting 4",
    start: dayjs("2025-08-11 16:00").toDate(),
    end: dayjs("2025-08-11 16:30").toDate(),
    color: "#FFA500",
    userId: 4,
    status: "Pending",
  },
  {
    id: "9",
    title: "Meeting 5",
    start: dayjs("2025-08-11 16:30").toDate(),
    end: dayjs("2025-08-11 17:00").toDate(),
    color: "#FFA500",
    userId: 3,
    status: "Pending",
  },

  {
    id: "10",
    title: "Meeting 1",
    start: dayjs("2025-08-11 8:30").toDate(),
    end: dayjs("2025-08-11 9:00").toDate(),
    color: "blue",
    userId: 3,
    status: "Pending",
  },
  {
    id: "11",
    title: "Meeting 2",
    start: dayjs("2025-08-11 9.00").toDate(),
    end: dayjs("2025-08-11 11:00").toDate(),
    color: "blue",
    userId: 3,
    status: "Pending",
  },
  {
    id: "12",
    title: "Meeting 3 xsss weeee  eweewwe www",
    start: dayjs("2025-08-11 11.00").toDate(),
    end: dayjs("2025-08-11 11:15").toDate(),
    color: "blue",
    userId: 3,
    status: "Pending",
  },
//   
    {
    id: "21",
    title: "Test Event 1",
    start: dayjs("2025-08-01 09.00").toDate(),
    end: dayjs("2025-08-01 12:00").toDate(),
    color: "green",
    userId: 1,
    status: "Pending",
  },
    {
    id: "22",
    title: "Test Event 2",
    start: dayjs("2025-08-01 09.00").toDate(),
    end: dayjs("2025-08-01 12:00").toDate(),
    color: "green",
    userId: 1,
    status: "Pending",
  },
    {
    id: "23",
    title: "Test Event 2",
    start: dayjs("2025-08-01 09.00").toDate(),
    end: dayjs("2025-08-01 12:00").toDate(),
    color: "green",
    userId: 1,
    status: "Pending",
  },
    {
    id: "24",
    title: "Test Event 3",
    start: dayjs("2025-08-01 09.00").toDate(),
    end: dayjs("2025-08-01 12:00").toDate(),
    color: "green",
    userId: 1,
    status: "Pending",
  },
    {
    id: "25",
    title: "Test Event 4",
    start: dayjs("2025-08-01 09.00").toDate(),
    end: dayjs("2025-08-01 12:00").toDate(),
    color: "green",
    userId: 1,
    status: "Pending",
  },
    {
    id: "26",
    title: "Test Event 5",
    start: dayjs("2025-08-01 09.00").toDate(),
    end: dayjs("2025-08-01 12:00").toDate(),
    color: "green",
    userId: 1,
    status: "Pending",  
  },
    {
    id: "27",
    title: "Test Event 6",
    start: dayjs("2025-08-01 13.00").toDate(),
    end: dayjs("2025-08-01 18:00").toDate(),
    color: "green",
    userId: 1,
    status: "Pending",
  },
];


export {events}