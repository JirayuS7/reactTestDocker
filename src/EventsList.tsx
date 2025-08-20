import { Button, Card, Space, Tooltip } from "antd";
import { RightCircleOutlined } from "@ant-design/icons";
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
          const buttonTitle = eventEl.getAttribute('title') || '';
          const eventTitle = eventEl.innerText;
          const parentCard = eventEl.closest('.ant-card');
          const cardTitle = parentCard?.querySelector('.ant-card-head-title')?.textContent || 'Event';
          
          // Determine time based on button type
          let startTime = '09:00';
          let endTime = '10:00';
          
          if (buttonTitle.includes('Morning')) {
            startTime = '06:00';
            endTime = '12:00';
          } else if (buttonTitle.includes('Afternoon')) {
            startTime = '12:00';
            endTime = '18:00';
          }
          
          return {
            title: `${cardTitle} - ${eventTitle}`,
            duration: buttonTitle.includes('Morning') ? '06:00' : '06:00', // 6 hours duration
            extendedProps: {
              timeSlot: eventTitle.toLowerCase(), // 'morning' or 'afternoon'
              startTime: startTime,
              endTime: endTime
            }
          };
        },
      });
    }
  }, []);

  return (
    <div ref={containerRef}>
      <h3>Add Event List </h3>

      <Space direction="vertical"  >
        {events.map((event) => (
          <Card key={event.key} title={event.title} 
           size="small"
            extra={<a href="#" style={{
              color: "blue"
            }}><RightCircleOutlined /></a>}

          >
            <Tooltip title="Drag to Calendar">
              <Space    >
                <Button color="cyan" variant="dashed"  className="fc-event"
                  title="Morning Time : 06:00 - 12:00"
                >
                  Morning  
                </Button>
                <Button color="primary" variant="dashed"  className="fc-event"
                  title="Afternoon Time : 12:00 - 18:00"
                >
                  Afternoon 
                </Button>
              </Space></Tooltip>
              
          </Card>
        ))}



        {events.length == 0 && <p>No events available</p>}
      </Space>
    </div>
  );
}
