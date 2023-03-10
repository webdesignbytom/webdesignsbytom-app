import React, { useContext, useEffect, useState } from 'react';
// Context
import { UserContext } from '../../context/UserContext';
// Components
import Navbar from '../../components/nav/Navbar';
import LoggedInUser from '../../utils/LoggedInUser';
import SearchOptionsAdmin from '../../components/admin/SearchOptionsAdmin'
// Fetch
import {
  setFormByUserId,
} from '../../utils/Fetch';
// Data
import client from '../../utils/client';
import NotificationsContainer from '../../components/notifications/NotificationsContainer';
import MessagesContainer from '../../components/messages/MessagesContainer';
import Designs from '../../components/account/Designs';
import Projects from '../../components/account/Projects';
import AdminOverview from '../../components/admin/AdminOverview';
import UsersContainer from '../../components/users/UsersContainer';


function AdminPanel() {
  const { user } = useContext(UserContext);
  const [updateUserForm, setUpdateUserForm] = useState(user);
  const [resendVerification, setResendVerification] = useState(true);
  // Users
  const [allUsers, setAllUsers] = useState([])
  // Notifications
  const [allNotifications, setAllNotifications] = useState([]);
  // Messages
  const [userMessages, setUserMessages] = useState([]);
  // Display items
  const [displayOverview, setDisplayOverview] = useState(false);
  const [displayProjects, setDisplayProjects] = useState(false);
  const [displayUsers, setDisplayUsers] = useState(false);
  const [displaySearch, setDisplaySearch] = useState(false);
  const [displayFixed, setDisplayFixed] = useState(true);
  const [selectedNavElement, setSelectedNavElement] = useState('overview');
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

      client
      .get(`/users`)
      .then((res) => {
        console.log('response', res.data);
        setAllUsers(res.data.data.users);
      })
      .catch((err) => {
        console.error('Unable to get users', err);
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
            Admin Panel: {user.firstName} {user.lastName}
            </h1>
          </div>
          {/* Main Container */}
          <section className='interaction__container'>
            {/* Left */}
            <section className='grid lg:grid-rows-reg'>
              {/* Nav */}
              <nav className='p-2 lg:w-[90%] lg:pr-12 border-b-2 border-hover-text border-solid w-full'>
                <ul className='flex justify-between lg:text-left lg:gap-24'>
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
                      setDisplayUsers(true);
                      setDisplayFixed(false);
                    }}
                    onMouseLeave={() => {
                      setDisplayUsers(false);
                      setDisplayFixed(true);
                    }}
                    onClick={() => setSelectedNavElement('users')}
                    className='cursor-pointer text-active-text hover:text-hover-text active:text-active-text'
                  >
                    Users
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
                  <li
                    onMouseEnter={() => {
                      setDisplaySearch(true);
                      setDisplayFixed(false);
                    }}
                    onMouseLeave={() => {
                      setDisplaySearch(false);
                      setDisplayFixed(true);
                    }}
                    onClick={() => setSelectedNavElement('search')}
                    className='cursor-pointer text-active-text hover:text-hover-text active:text-active-text'
                  >
                    Search
                  </li>
                </ul>
              </nav>
              {/* Content */}
              <section className='my-2'>
                {displayOverview && <AdminOverview />}
                {displayUsers && <UsersContainer users={allUsers} />}
                {displayProjects && <Projects />}
                {displaySearch && <SearchOptionsAdmin />}
                {selectedNavElement === 'overview' && displayFixed === true && (
                  <AdminOverview />
                )}
                {selectedNavElement === 'users' && displayFixed === true && (
                  <UsersContainer users={allUsers} />
                )}
                {selectedNavElement === 'projects' && displayFixed === true && (
                  <Projects />
                )}
                {selectedNavElement === 'search' && displayFixed === true && (
                  <SearchOptionsAdmin />
                )}
              </section>
            </section>
            {/* Right */}
            <section className='hidden lg:grid lg:grid-rows-ls gap-2 overflow-hidden'>
              {/* Messages */}
              <section className='grid lg:grid-rows-2 gap-1 border-2 border-black border-solid rounded-sm overflow-hidden p-1'>
                <section className='grid border-2 border-black border-solid rounded-sm overflow-hidden'>
                  <h3 className='border-b-2 border-black border-solid pl-2 py-1 bg-main-colour lg:bg-white'>
                    Notifications
                  </h3>
                  <div className='max-h-[300px] lg:max-h-none overflow-scroll overflow-x-hidden bg-main-colour'>
                    <NotificationsContainer notifications={allNotifications} />
                  </div>
                </section>
                <section className='grid border-2 border-black border-solid rounded-sm overflow-hidden'>
                  <h3 className='border-b-2 border-black border-solid pl-2 py-1 bg-main-colour lg:bg-white'>
                    Messages
                  </h3>
                  <div className='max-h-[300px] lg:max-h-none overflow-scroll overflow-x-hidden bg-main-colour'>
                    <MessagesContainer messages={userMessages} />
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

export default AdminPanel;
