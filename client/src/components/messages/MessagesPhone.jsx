import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import client from '../../utils/client';
import MessageItem from './MessageItem';
function MessagesPhone() {
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
        console.error('Unable to mark notification as seen', err);
      });
  }, []);

  return (
    <>
      <div>
        <div className='flex mx-2 my-4 justify-between border-b-2 border-black border-solid pb-4'>
          <div className='flex align-middle font-bold pt-1'>
            <h2>Messages</h2>
          </div>
        </div>
        {/* Notification list */}
        <section className='grid gap-2 mx-2 lg:mx-6'>
          <ul>
            {userMessages.length > 0 &&
              userMessages.map((message, index) => {
                return (
                  <li className='mb-2'>
                    <MessageItem key={index} message={message} />
                  </li>
                )
              })}
          </ul>
        </section>
      </div>
    </>
  );
}

export default MessagesPhone;