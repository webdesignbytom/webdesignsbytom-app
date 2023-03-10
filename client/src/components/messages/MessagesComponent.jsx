import React, { useContext, useEffect, useState } from 'react';
// Context
import { UserContext } from '../../context/UserContext';
// Components
import MessageItem from './MessageItem';
import client from '../../utils/client';

function MessagesComponent() {
  const { user } = useContext(UserContext);
  const [userMessages, setUserMessages] = useState([]);
  console.log('userMessages', userMessages);

  useEffect(() => {
    client
      .get(`/messages/user-messages/${user.id}`)
      .then((res) => {
        console.log('response', res.data);
        setUserMessages(res.data.data.messages);
      })
      .catch((err) => {
        console.error('Unable to get user messages', err);
      });
  }, [user.id]);

  return (
    <>
      <section className='grid max-h-[300px] border-2 border-black border-solid overflow-hidden'>
        <div>
          <h3>Messages</h3>
        </div>
        <section>
          <ul className='w-full'>
            {userMessages.length > 0 &&
              userMessages.map((message, index) => {
                return <MessageItem key={index} message={message} />;
              })}
          </ul>
        </section>
      </section>
    </>
  );
}

export default MessagesComponent;
