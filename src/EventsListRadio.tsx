import {
  Button,
  Card,
  ConfigProvider,
  Space,
  Modal,
  DatePicker,
  Flex,
  Checkbox,
  Row,
  Col,
} from "antd";
import type { Dayjs } from "dayjs";

import { useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { checkLimitEvent } from "./services/checkLimitEvent";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
export interface EventItem {
  key: string;
  title: string;
  timeSlot?: string; // 'morning' or 'afternoon'
  start?: Date;
  end?: Date;
  userId: number;
  color?: string;
}

export default function EventsListRadio({
  events,
  selectedUser,
  setSelectedUser,
  eventsList,
  setEventsList,
  limitModalOpen,
  setLimitModalOpen,
  onNavigateToDate,
}: {
  events: EventItem[];
  selectedUser: number[] | null;
  setSelectedUser: (user: number[] | null) => void;
  eventsList: EventItem[];
  setEventsList: (events: EventItem[]) => void;
  limitModalOpen: boolean;
  setLimitModalOpen: (open: boolean) => void;
  onNavigateToDate?: (date: Date) => void;
}) {
  // Modal state for event limit warning

  const containerRef = useRef(null);

  //  form
  const [selectedEvent, setSelectedEvent] = useState<EventItem[]>([]);
  const [activeSelect, setActiveSelect] = useState<boolean>(false);

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

    const eventSource = [...eventsList, ...selectedEvent];

    if (dateRange[0] && dateRange[1]) {
      const check = checkLimitEvent({
        dateRange,
        selectedEvent,
        eventSource,
        setLimitModalOpen,
      });

      if (check) {
        return;
      }
    }

    // Add events if limit not exceeded
    const oldData = eventsList;
    const newEvents = [
      ...oldData,
      ...selectedEvent.map((event) => ({
        ...event,
        title: `Monthly meeting (${event.timeSlot})`,
        start: dateRange[0]?.toDate(),
        end: dateRange[1]?.toDate(),
      })),
    ];
    setEventsList(newEvents);
    localStorage.setItem("calendarEvents", JSON.stringify(newEvents));

    // Navigate calendar to the selected date if provided
    if (onNavigateToDate && dateRange[0]) {
      onNavigateToDate(dateRange[0].toDate());
    }

    setIsModalOpen(false);
    setDateRange([null, null]);
    setSelectedEvent([]);
  }

  const ModalWarning = (
    <Modal
      title="Daily task limit reached"
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
        {/* {limitModalDate && (
          <span>
            <strong>Date:</strong> {limitModalDate.toLocaleDateString()}
          </span>
        )} */}
        <span
          style={{
            color: "#FF2D55",
            fontWeight: "bold",
          }}
        >
          More than 7 tasks have been assigned today.
        </span>
      </Space>
    </Modal>
  );

  const checkSubmitButton = selectedEvent && selectedEvent?.length > 0;
  const checkClearButton =
    (selectedUser && selectedUser?.length > 0) ||
    (selectedEvent && selectedEvent?.length > 0);

  return (
    <div ref={containerRef} className="EventInspectorName">
      {ModalWarning}
      <h3>Inspector Name </h3>

      <Flex
        align="center"
        gap={10}
        className="button-group"
        justify="center"
        vertical={true}
      >
        {events &&
          events.map((event) =>
            eventCard(
              event,
              selectedUser,
              setSelectedUser,
              setSelectedEvent,
              selectedEvent,
              activeSelect,
              setActiveSelect
            )
          )}
      </Flex>

      {events.length == 0 && <p>No events available</p>}

      {/* Date Range Modal */}
      <Modal
        title="Select the date range for your event"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button
            key="cancel"
            onClick={() => setIsModalOpen(false)}
            variant="filled"
            color="default"
            style={{
              color: "#fff",
              backgroundColor: "#CACACA",
            }}
          >
            Cancel
          </Button>,
          <Button
            key="ok"
            type="primary"
            onClick={handleModalSubmit}
            disabled={!dateRange[0] || !dateRange[1]}
          >
            Add Event to Calendar
          </Button>,
        ]}
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

      <Flex justify="end" gap={10}>
        {" "}
        <div style={{ marginTop: "16px" }}>
          <Button
            type="primary"
            onClick={AddNewEvent}
            disabled={!checkSubmitButton}
          >
            Submit Events ( {selectedEvent.length} )
          </Button>
        </div>
        <div style={{ marginTop: "16px" }}>
          <Button
            color="primary"
            variant="outlined"
            disabled={!checkClearButton}
            onClick={() => {
              // Clear all events logic
              setSelectedUser([]);
              setSelectedEvent([]);
            }}
          >
            Clear
          </Button>
        </div>
      </Flex>
    </div>
  );
}

function eventCard(
  event: EventItem,
  selectedUser: number[] | null,
  setSelectedUser: (user: number[] | null) => void,
  setSelectedEvent: Dispatch<SetStateAction<EventItem[]>>,
  selectedEvent: EventItem[],
  activeSelect: boolean,
  setActiveSelect: (active: boolean) => void
) {
  const active = selectedUser?.includes(event.userId) && activeSelect;

  function ChangeUser(e: CheckboxChangeEvent) {
    if (e.target.checked) {
      // Add userId if not already present
      if (!selectedUser?.includes(event.userId)) {
        setSelectedUser([...(selectedUser ?? []), event.userId]);
      }
    } else {
      // Remove userId when unchecked
      setSelectedUser((selectedUser ?? []).filter((id) => id !== event.userId));
    }
  }

  return (
    <Card
      key={event.key}
      className={` ${active ? "selectedCard w-100" : "w-100"}`}
      size="small"
      onClick={() => {
        if (!activeSelect) {
          setActiveSelect(true);
          setSelectedUser([event.userId]);
        }
      }}
    >
      <Row gutter={8} align="middle">
        <Col span={15}>
          <div className="event-card-info">
            {" "}
            <div>
              <div>
                {" "}
                {activeSelect ? (
                  <Checkbox
                    onChange={(e) => {
                      ChangeUser(e);
                    }}
                    checked={selectedUser?.includes(event.userId)}
                  >
                    {" "}
                    <strong> Name :</strong>{" "}
                    <span style={{ marginLeft: "8px" }}> {event.title} </span>
                  </Checkbox>
                ) : (
                  <div>
                    <strong style={{ marginLeft: 28 }}> Name :</strong>{" "}
                    <span style={{ marginLeft: "8px" }}> {event.title} </span>
                  </div>
                )}
              </div>
              <div
                style={{
                  marginLeft: 27,
                  display: "flex",
                }}
              >
                <strong> Email :</strong>{" "}
                <span className="wrapText" style={{ marginLeft: "8px" }}>
                  {" "}
                  zAdsawamateI@pttep.com
                </span>
              </div>
            </div>{" "}
          </div>
        </Col>

        <Col span={9}>
          <Flex className="action-buttons" align="center" justify="end" gap={8}>
            <Button
              color="primary"
              variant={"solid"}
              title="Morning Time : 06:00 - 12:00"
              onClick={() => {
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
                });

                setSelectedUser([...(selectedUser ?? []), event.userId]);
              }}
              style={{
                opacity: selectedEvent.some(
                  (e) => e.key === event.key && e.timeSlot === "morning"
                )
                  ? 1
                  : 0.5,
              }}
            >
              Morning
            </Button>
            <Button
              color="cyan"
              variant={"solid"}
              style={{
                opacity: selectedEvent.some(
                  (e) => e.key === event.key && e.timeSlot === "afternoon"
                )
                  ? 1
                  : 0.5,
              }}
              title="Afternoon Time : 12:00 - 18:00"
              onClick={() => {
                setSelectedEvent((prev: EventItem[]) => {
                  const isSelected = prev.some(
                    (e) => e.key === event.key && e.timeSlot === "afternoon"
                  );
                  if (isSelected) {
                    // Remove this slot
                    return prev.filter(
                      (e) =>
                        !(e.key === event.key && e.timeSlot === "afternoon")
                    );
                  } else {
                    // Remove any existing slot for this event, then add afternoon
                    const filtered = prev.filter((e) => e.key !== event.key);
                    return [...filtered, { ...event, timeSlot: "afternoon" }];
                  }
                });
                setSelectedUser([...(selectedUser ?? []), event.userId]);
              }}
            >
              Afternoon
            </Button>
          </Flex>
        </Col>
      </Row>
    </Card>
  );
}
