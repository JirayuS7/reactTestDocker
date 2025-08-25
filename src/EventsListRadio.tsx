import {
  Button,
  Card,
  ConfigProvider,
  Space,
  Modal,
  DatePicker,
  message,
} from "antd";
import type { Dayjs } from "dayjs";
import {
  CheckSquareOutlined,
  CloseCircleOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { useRef, useState } from "react";
import { createStyles } from "antd-style";
import type { Dispatch, SetStateAction } from "react";
import dayjs from "dayjs";
interface EventItem {
  key: string;
  title: string;
  timeSlot?: string; // 'morning' or 'afternoon'
  start?: Date;
  end?: Date;
}
const useStyle = createStyles(({ prefixCls, css }) => ({
  linearGradientButton: css`
    &.${prefixCls}-btn-primary:not([disabled]):not(
        .${prefixCls}-btn-dangerous
      ) {
      > span {
        position: relative;
      }

      &::before {
        content: "";
        background: linear-gradient(135deg, #6253e1, #04befe);
        position: absolute;
        inset: -1px;
        opacity: 1;
        transition: all 0.3s;
        border-radius: inherit;
      }

      &:hover::before {
        opacity: 0;
      }
    }
  `,
}));


export default function EventsListRadio({
  events,
  selectedUser,
  setSelectedUser,
  eventsList,
  setEventsList,
}: {
  events: EventItem[];
  selectedUser: string | null;
  setSelectedUser: (user: string | null) => void;
  eventsList: EventItem[];
  setEventsList: (events: EventItem[]) => void;
}) {
  // Modal state for event limit warning
  const [limitModalOpen, setLimitModalOpen] = useState(false);
  // const [limitModalDate, setLimitModalDate] = useState<Date | null>(null);
  const containerRef = useRef(null);

  //  form
  const [selectedEvent, setSelectedEvent] = useState<EventItem[]>([]);

  // Modal state for date range selection
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([
    null,
    null,
  ]);

  function AddNewEvent() {
    setIsModalOpen(true);
  }

  function handleModalSubmit() {
    // Check event limit for each date in the range
    const eventLimit = 7;
    const eventSource = [...eventsList, ...selectedEvent];

    if (dateRange[0] && dateRange[1]) {
      const startDate = dayjs(dateRange[0]);
      const endDate = dayjs(dateRange[1]);

      // For each selected event, check if adding it would exceed the limit for that user (key) on the same day
      for (let i = 0; i < selectedEvent.length; i++) {
        const event = selectedEvent[i];
        const eventKey = event.key;
        // Check for each day in the range
        let currentDate = startDate.clone();
        while (currentDate.isBefore(endDate, 'day') || currentDate.isSame(endDate, 'day')) {
          // Count events for this key on this day
          const eventCount = eventSource.filter(
            (e) => e.key === eventKey && dayjs(e.start).isSame(currentDate, 'day')
          ).length;
          if (eventCount >= eventLimit) {
            setLimitModalOpen(true);
            message.error(
              `Cannot add event for user ${eventKey} on ${currentDate.format(
                "YYYY-MM-DD"
              )}: Maximum of ${eventLimit} events allowed per user per day.`
            );
            return;
          }
          currentDate = currentDate.add(1, 'day');
        }
      }
    }

    // Add events if limit not exceeded
    const oldData = eventsList;
    const newEvents = [
      ...oldData,
      ...selectedEvent.map((event) => ({
        ...event,
        start: dateRange[0]?.toDate(),
        end: dateRange[1]?.toDate(),
      })),
    ];
    setEventsList(newEvents);
    localStorage.setItem("calendarEvents", JSON.stringify(newEvents));

    setIsModalOpen(false);
    setDateRange([null, null]);
    setSelectedEvent([]);
  }

  const { styles } = useStyle();

  const ModalWarning = (
    <Modal
      title="Event Limit Reached"
      open={limitModalOpen}
      onCancel={() => setLimitModalOpen(false)}
      footer={[
        <Button
          key="ok"
          type="primary"
          onClick={() => setLimitModalOpen(false)}
        >
          OK
        </Button>,
      ]}
    >
      <Space direction="vertical" style={{ width: "100%" }}>
        <span style={{ color: "#ff4d4f", fontWeight: "bold" }}>
          Cannot add event: Maximum of 7 events allowed per date.
        </span>
        {/* {limitModalDate && (
          <span>
            <strong>Date:</strong> {limitModalDate.toLocaleDateString()}
          </span>
        )} */}
        <span>
          Please choose a different date or remove an event from this date
          first.
        </span>
      </Space>
    </Modal>
  );

  return (
    <div ref={containerRef}>
      {ModalWarning}
      <h3>User List ({events.length}) </h3>

      {events &&
        events.map((event) =>
          eventCard(
            event,
            selectedUser,
            setSelectedUser,
            setSelectedEvent,
            selectedEvent
          )
        )}

      {events.length == 0 && <p>No events available</p>}

      {selectedEvent && selectedEvent?.length > 0 && (
        <ConfigProvider
          button={{
            className: styles.linearGradientButton,
          }}
        >
          <div style={{ marginTop: "16px" }}>
            <Button type="primary" size="large" onClick={AddNewEvent}>
              <PlusCircleOutlined /> Submit Events ( {selectedEvent.length} )
            </Button>
          </div>
        </ConfigProvider>
      )}

      {/* Date Range Modal */}
      <Modal
        title="Select Date Range for Event"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleModalSubmit}
        okText="Add Event to Calendar"
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <span>Select the date range for your event:</span>
          <ConfigProvider>
            <DatePicker.RangePicker
              style={{ width: "100%" }}
              value={dateRange}
              onChange={(dates: [Dayjs | null, Dayjs | null] | null) => {
                setDateRange(dates ?? [null, null]);
              }}
            />
          </ConfigProvider>
        </Space>
      </Modal>

      {selectedUser && selectedEvent && (
        <div style={{ marginTop: "16px" }}>
          <Button
            color="primary"
            variant="filled"
            onClick={() => {
              // Clear all events logic
              setSelectedUser(null);
              setSelectedEvent([]);
            }}
          >
            <CloseCircleOutlined /> Clear All
          </Button>
        </div>
      )}
    </div>
  );
}

function eventCard(
  event: EventItem,
  selectedUser: string | null,
  setSelectedUser: (user: string | null) => void,
  setSelectedEvent: Dispatch<SetStateAction<EventItem[]>>,
  selectedEvent: EventItem[]
) {
  const active = selectedUser === event.key;

  return (
    <Card
      key={event.key}
      className={` ${selectedUser === event.key ? "selectedCard" : ""}`}
      size="small"
    >
      <div>
        {" "}
        <h3
          onClick={() => setSelectedUser(event.key)}
          style={{
            margin: "5px 0 15px 0",
            cursor: "pointer",
          }}
        >
          {active && <CheckSquareOutlined color="#13c2c2" />}
          <span style={{ marginLeft: "8px" }}> {event.title} </span>
        </h3>{" "}
      </div>
      <Space>
        <Button
          color="cyan"
          variant={
            selectedEvent.some(
              (e) => e.key === event.key && e.timeSlot === "morning"
            )
              ? "solid"
              : "dashed"
          }
          title="Morning Time : 06:00 - 12:00"
          onClick={() =>
            setSelectedEvent((prev: EventItem[]) => {
              const isSelected = prev.some(
                (e) => e.key === event.key && e.timeSlot === "morning"
              );
              if (isSelected) {
                // Remove this slot
                return prev.filter(
                  (e) => !(e.key === event.key && e.timeSlot === "morning")
                );
              } else {
                // Remove any existing slot for this event, then add morning
                const filtered = prev.filter((e) => e.key !== event.key);
                return [...filtered, { ...event, timeSlot: "morning" }];
              }
            })
          }
        >
          Morning
        </Button>
        <Button
          color="primary"
          variant={
            selectedEvent.some(
              (e) => e.key === event.key && e.timeSlot === "afternoon"
            )
              ? "solid"
              : "dashed"
          }
          title="Afternoon Time : 12:00 - 18:00"
          onClick={() =>
            setSelectedEvent((prev: EventItem[]) => {
              const isSelected = prev.some(
                (e) => e.key === event.key && e.timeSlot === "afternoon"
              );
              if (isSelected) {
                // Remove this slot
                return prev.filter(
                  (e) => !(e.key === event.key && e.timeSlot === "afternoon")
                );
              } else {
                // Remove any existing slot for this event, then add afternoon
                const filtered = prev.filter((e) => e.key !== event.key);
                return [...filtered, { ...event, timeSlot: "afternoon" }];
              }
            })
          }
        >
          Afternoon
        </Button>
      </Space>
    </Card>
  );
}
