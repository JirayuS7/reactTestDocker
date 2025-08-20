import React from "react";
import { Avatar, List } from "antd";
import "./UserLists.css"; // Import the CSS file for styling

const data = [
  {
    title: "Alex bot Brown",
  },
  {
    title: "Samantha Brown",
  },
  {
    title: "Desmond Brown ",
  },
  {
    title: "Charlie Brown",
  },
];

const UserLists: React.FC = () => (
  <>
    <h3>User Lists</h3>
    <List
      itemLayout="horizontal"
      dataSource={data}
      className="user-lists"
      renderItem={(item, index) => (
        <List.Item>
          <List.Item.Meta
            avatar={
              <Avatar
                src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`}
              />
            }
            title={<a href="https://ant.design">{item.title}</a>}
          />
        </List.Item>
      )}
    />
  </>
);

export default UserLists;
