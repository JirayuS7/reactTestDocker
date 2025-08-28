import { Button, Card, Modal } from "antd";
import Meta from "antd/es/card/Meta";
import { useState } from "react";
import Calendar from "./Celendar";

export default function EventDetail() {
  const [isModalOpen, setIsModalOpen] = useState(true);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Card
        hoverable
        style={{ width: 240 }}
      >
        <Meta title="Calendar MockUp" description="http://localhost:5173/" />
        <br/>
        <Button type="primary" size="large" onClick={showModal}>
          Show Calendar
        </Button>
      </Card>

      <Modal
        // title="Calendar"
        className="calendar-modal"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width="100vw"
        style={{
          top: 0,
          paddingBottom: 0,
          maxWidth: "none"
        }}
        // bodyStyle={{
        //   height: "100vh",
        //   padding: 0,
        //   overflow: "hidden"
        // }}
        centered={false}
        closable={true}
        maskClosable={false}
      >
        <Calendar />
      </Modal>
    </>
  );
}
