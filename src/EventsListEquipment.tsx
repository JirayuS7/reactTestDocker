import {   Flex    } from "antd";
import { useEffect, useState } from "react";

export default function EventsListEquipment() {
  const listsMockUp = [
    {
      id: 1,
      date: "2023-09-01",
      title: "PLCPP2-PK1530 Turbo-Expander Preparation",
      color: "#7AB800",
    },
    {
      id: 2,
      date: "2023-09-02",
      title: "PLCPP2-PK1530 Turbo-Expander Testing",
      color: "#7AB800",
    },
    {
      id: 3,
      date: "2023-09-03",
      title: "PLCPP2-PK1530 Turbo-Expander Maintenance",
      color: "#FEBC2F",
    },
    {
      id: 4,
      date: "2023-09-04",
      title: "PLCPP2-PK1530 Turbo-Expander Decommissioning",
      color: "#FEBC2F",
    },
    {
      id: 5,
      date: "2023-09-05",
      title: "PLCPP2-PK1530 Turbo-Expander Inspection",
      color: "#7E7E88",
    },
    {
      id: 6,
      date: "2023-09-06",
      title: "PLCPP2-PK1530 Turbo-Expander Testing",
      color: "#7E7E88",
    },
    {
      id: 7,
      date: "2023-09-06",
      title: "PLCPP2-PK1530 Turbo-Expander Testing",
      color: "#7E7E88",
    },
  ];

  const [lists, setLists] = useState(listsMockUp);

  const [active, setActive] = useState<number | null>(1);

  useEffect(() => {
    // Fetch or manipulate data when the component mounts or updates

    if (active === 1) {
      // Fetch or manipulate data for active schedule
      setLists(listsMockUp);
    } else if (active === 2) {
      // Fetch or manipulate data for active unschedule
      //    random
      setLists(listsMockUp.filter((item) => item.id !== 1));
    }
  }, [active]);

  return (
    <div className="events-list-equipment">
      <Flex align="center" className="button-group" justify="center">
        <button
          className="btn btn-large"
          style={{
            backgroundColor: active === 1 ? "#7CDCFD" : undefined,
          }}
          onClick={() => setActive(1)}
        >
          Schedule
        </button>
        <button
          className="btn btn-large"
          onClick={() => setActive(2)}
          style={{
            backgroundColor: active === 2 ? "#7CDCFD" : undefined,
          }}
        >
          Unschedule
        </button>
      </Flex>
   
        <ul>
          {lists.map((event) => (
            <li key={event.id}>
              <span
                className="dot"
                style={{
                  backgroundColor: event.color || "#7E7E88",
                }}
              ></span>{" "}
              <span> {event.date}</span> <span>{event.title}</span>
            </li>
          ))}
        </ul>
    
      <div className="note">
        None plan task (Plan with out plan start date - plan completed date)
      </div>
    </div>
  );
}
