import React, { useContext, useEffect, useState } from 'react';
// Context
import { UserContext } from '../../context/UserContext';
// Components
import Navbar from '../../components/nav/Navbar';
import NotificationsContainer from '../../components/notifications/NotificationsContainer';
import MessagesContainer from '../../components/messages/MessagesContainer';
import Overview from '../../components/account/AccountOverview';
import Designs from '../../components/account/Designs';
import Projects from '../../components/account/Projects';
import LoadingSpinner from '../../components/LoadingSpinner';
import AccountOverview from '../../components/account/AccountOverview';
// Fetch
import {
  setFormByUserId,
} from '../../utils/Fetch';
// Utils
import LoggedInUser from '../../utils/LoggedInUser';
import client from '../../utils/client';

function Account() {
  const { user } = useContext(UserContext);
  const [updateUserForm, setUpdateUserForm] = useState(user);
  const [resendVerification, setResendVerification] = useState(true);
  // Notifications
  const [allNotifications, setAllNotifications] = useState([]);
  // Messages
  const [userMessages, setUserMessages] = useState([]);
  // Display items
  const [displayOverview, setDisplayOverview] = useState(false);
  const [displayProjects, setDisplayProjects] = useState(false);
  const [displayDesigns, setDisplayDesigns] = useState(false);
  const [selectedNavElement, setSelectedNavElement] = useState('overview');
  const [displayFixed, setDisplayFixed] = useState(true);
  // Favorites
  const [listOfFavorites, setListOfFavorites] = useState([]);

  useEffect(() => {
    const foundUser = LoggedInUser();
    setFormByUserId(foundUser.id, setUpdateUserForm);

    // Notifications
    client
      .get(`/notifications/user-notifications/${user.id}`)
      .then((res) => {
        console.log('res', res.data);
        setAllNotifications(res.data.data.notifications);
      })
      .catch((err) => {
        console.error('Unable to get notifications', err);
      });

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

  useEffect(() => {
    setTimeout(() => {
      if (!user.isVerified) {
        setResendVerification(false);
      }
    }, 2000);
  }, [user.isVerified]);

  return (
    <>
      <div className='bg-white dark:bg-black lg:max-h-screen lg:overflow-hidden'>
        <Navbar />
        {/* Main */}
        <section className='grid lg:h-[calc(100vh-64px)] lg:max-h-[calc(100vh-64px)] lg:grid-rows-reg overflow-hidden'>
          {/* Titles */}
          <div className='text-left mt-4 mb-1 pl-4 lg:mx-6'>
            <h1 className='font-bold text-xl'>
              Account: {user.firstName} {user.lastName}
            </h1>
          </div>
          {/* Main Container */}
          <section className='interaction__container'>
            {/* Left */}
            <section className='grid lg:grid-rows-reg'>
              {/* Nav */}
              <nav className='p-2 lg:w-[90%] lg:pr-12 border-b-2 border-hover-text border-solid'>
                <ul className='flex lg:text-left gap-24'>
                  <li
                    onMouseEnter={() => {
                      setDisplayOverview(true);
                      setDisplayFixed(false);
                    }}
                    onMouseLeave={() => {
                      setDisplayOverview(false);
                      setDisplayFixed(true);
                    }}
                    onClick={() => setSelectedNavElement('overview')}
                    className='cursor-pointer text-active-text hover:text-hover-text active:text-active-text'
                  >
                    Overview
                  </li>
                  <li
                    onMouseEnter={() => {
                      setDisplayDesigns(true);
                      setDisplayFixed(false);
                    }}
                    onMouseLeave={() => {
                      setDisplayDesigns(false);
                      setDisplayFixed(true);
                    }}
                    onClick={() => setSelectedNavElement('designs')}
                    className='cursor-pointer text-active-text hover:text-hover-text active:text-active-text'
                  >
                    Designs
                  </li>

                  <li
                    onMouseEnter={() => {
                      setDisplayProjects(true);
                      setDisplayFixed(false);
                    }}
                    onMouseLeave={() => {
                      setDisplayProjects(false);
                      setDisplayFixed(true);
                    }}
                    onClick={() => setSelectedNavElement('projects')}
                    className='cursor-pointer text-active-text hover:text-hover-text active:text-active-text'
                  >
                    Projects
                  </li>
                </ul>
              </nav>
              {/* Content */}
              <section className='my-2'>
                {displayOverview && <Overview />}
                {displayDesigns && <Designs />}
                {displayProjects && <Projects />}
                {selectedNavElement === 'overview' && displayFixed === true && (
                  <AccountOverview />
                )}
                {selectedNavElement === 'designs' && displayFixed === true && (
                  <Designs />
                )}
                {selectedNavElement === 'projects' && displayFixed === true && (
                  <Projects />
                )}
              </section>
            </section>
            {/* Right */}
            <section className='grid lg:grid-rows-ls gap-2 overflow-hidden'>
              {/* Messages */}
              <section className='grid lg:grid-rows-2 gap-1 border-2 border-black border-solid rounded-sm overflow-hidden p-1'>
                <section className='grid lg:grid-rows-reg border-2 border-black border-solid rounded-sm overflow-hidden'>
                  <h3 className='border-b-2 border-black border-solid pl-2 py-1 bg-main-colour lg:bg-white'>
                    Notifications
                  </h3>
                  <div className='grid max-h-[300px] lg:max-h-none lg:items-center overflow-scroll overflow-x-hidden bg-main-colour'>
                    {allNotifications.length < 1 ? (
                      <div className='grid grid-rows-1'>
                        <LoadingSpinner height={'12'} width={'12'} />
                      </div>
                    ) : (
                      <NotificationsContainer
                        notifications={allNotifications}
                      />
                    )}
                  </div>
                </section>

                <section className='grid lg:grid-rows-reg border-2 border-black border-solid rounded-sm overflow-hidden'>
                  <h3 className='border-b-2 border-black border-solid pl-2 py-1 bg-main-colour lg:bg-white'>
                    Messages
                  </h3>
                  <div className='grid max-h-[300px] lg:max-h-none lg:items-center overflow-scroll overflow-x-hidden bg-main-colour w-full'>
                    {allNotifications.length < 1 ? (
                      <div className='grid grid-rows-1'>
                        <LoadingSpinner height={'12'} width={'12'} />
                      </div>
                    ) : (
                      <MessagesContainer messages={userMessages} />
                    )}
                  </div>
                </section>
              </section>
              {/* Favorites */}
              <section className='hidden lg:grid border-2 border-black border-solid rounded-sm p-1'>
                <div className='border-2 border-black border-solid rounded-sm overflow-hidden'>
                  <h3 className='border-b-2 border-black border-solid pl-2 py-1'>
                    Favorites
                  </h3>
                  <ul className='bg-main-colour grid h-full'>
                    {listOfFavorites > 0 ? (
                      listOfFavorites.map((favorite, index) => {
                        return <li key={index}>{favorite.name}</li>;
                      })
                    ) : (
                      <div className='grid justify-center'>
                        <p>Nothing to display</p>
                      </div>
                    )}
                  </ul>
                </div>
              </section>
            </section>
          </section>
          {/* {!resendVerification && (
            <ResendConfirmEmail handleResend={handleResend} />
          )} */}
        </section>
      </div>
    </>
  );
}

export default Account;
