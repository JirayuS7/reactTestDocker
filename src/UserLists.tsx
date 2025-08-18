import React from 'react';
import { Avatar, List } from 'antd';
import './UserLists.css'; // Import the CSS file for styling

const data = [
  {
    title: 'Ant Design Title 1',
  },
  {
    title: 'Ant Design Title 2',
  },
  {
    title: 'Ant Design Title 3',
  },
  {
    title: 'Ant Design Title 4',
  },
];

const UserLists: React.FC = () => (

    <> 
    <h3>
        User Lists
    </h3>
  <List
    itemLayout="horizontal"
    dataSource={data}
    className='user-lists'
    renderItem={(item, index) => (
      <List.Item >
        <List.Item.Meta
          avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
          title={<a href="https://ant.design">{item.title}</a>}
          description="Ant Design, a design language for background applications, is refined by Ant UED Team"
        />
      </List.Item>
    )}
  /></>
);

export default UserLists;