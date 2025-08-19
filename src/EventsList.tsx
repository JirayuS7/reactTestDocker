import { Button, Space } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Draggable } from "@fullcalendar/interaction";
import { useEffect, useRef } from "react";

interface EventItem {
  key: string;
  title: string;
}

interface EventsListProps {
  events: EventItem[];
}

export default function EventsList({ events }: EventsListProps) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      new Draggable(containerRef.current, {
        itemSelector: ".fc-event",
        eventData: function (eventEl) {
          return {
            title: eventEl.innerText,
            duration: "01:00",
          };
        },
      });
    }
  }, []);

  return (
    <div ref={containerRef}>
      <h3>Add Event List </h3>

      <Space direction="vertical" style={{ width: "100%" }}>
        {events.map((event) => (
          <Button
            style={{ cursor: "move" }}
            id={event.key}
            color="primary"
            variant="dashed"
            key={event.key}
            className="fc-event"
            block
          >
            {event.title} <PlusCircleOutlined />
          </Button>
        ))}
      </Space>
    </div>
  );
}
