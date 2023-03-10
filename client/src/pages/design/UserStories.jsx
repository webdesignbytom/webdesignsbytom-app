import React, { useContext, useEffect, useState } from 'react';
// Context
import { UserContext } from '../../context/UserContext';
// Icons
import QuestionMark from '../../img/questionMark.svg';
import BinIcon from '../../img/bin.svg';
// Utils
import { userStoryTemplate } from '../../utils/utils';

function UserStories({
  openDesign,
  setOpenDesign,
  userStories,
  setUserStories,
}) {
  const { user } = useContext(UserContext);
  const [newUserStory, setNewUserStory] = useState(userStoryTemplate);
  const [errorDisplay, setErrorDisplay] = useState({
    active: false,
    error: '',
  });
  const [tempId, setTempId] = useState(1)

  useEffect(() => {
    if (openDesign.id) {
      setNewUserStory({
        ...newUserStory,
        designId: openDesign.id,
      });
    }
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setErrorDisplay({ error: '', active: false })
    setNewUserStory({
      ...newUserStory,
      [name]: value,
    });
  };

  const handleCreate = (event) => {
    event.preventDefault();

    newUserStory.tempId = tempId
    const found = openDesign.userStories.find(
      (story) => story.content === newUserStory.content
    );

    if (found) {
      return setErrorDisplay({ error: 'Story already exists', active: true });
    }

    if (openDesign.id) {
      setOpenDesign({
        ...openDesign,
        designId: openDesign.id,
      });
    }

    setTempId(prev => prev + 1)
    setUserStories([...userStories, newUserStory]);

    setOpenDesign({
      ...openDesign,
      userStories: [...userStories, newUserStory],
    });

    setNewUserStory(userStoryTemplate)
  };

  const deleteUserStory = (story) => {
    const { tempId } = story
    console.log('content deleted', tempId)
    console.log('openDesign.userStories', openDesign.userStories)
    const newArray = openDesign.userStories
    console.log('new array', newArray)
    const found = newArray.filter(e => e.tempId === story.tempId)
    console.log('xx', newArray.indexOf(found))
    console.log('found', found)
    console.log('newArray', newArray)
  };

  return (
    <>
      <main>
        <div className='text-center py-2'>
          <h1>UserStories</h1>
        </div>
        <section className='mx-2'>
          <div className='flex justify-between mb-2'>
            <h2>Create New Story:</h2>
            <div className='group flex align-middle h-full pl-1'>
              <img
                src={QuestionMark}
                className='w-6 cursor-pointer group transition duration-200 ease-in-out hover:scale-125'
                alt='information'
                data-te-animation-init
              />
              <div className='hidden absolute group-hover:block border-2 border-black border-solid rounded bg-colour-med p-1 text-sm align-middle max-w-[250px] lg:w-[500px] right-2 lg:right-12'>
                A good user story is short description of an ability your app
                will require. For Example:
                <p>
                  'I want a user to be able to make, like and comment on posts'
                </p>
                <p>
                  'I want the app to record user events and display them to
                  admins'.
                </p>
              </div>
            </div>
          </div>
          <form onSubmit={handleCreate}>
            <div className='mb-2'>
              <textarea
                className='w-full rounded border-2 border-slate-400 border-solid'
                name='content'
                id='user-story'
                rows='2'
                onChange={handleChange}
                value={newUserStory.content}
                placeholder='I want to...'
              ></textarea>
            </div>
            {/* <!-- Submit button --> */}
            <div className='mb-2'>
              <button
                type='submit'
                className='submit__button'
                data-mdb-ripple='true'
                data-mdb-ripple-color='light'
              >
                
                {errorDisplay.active ? errorDisplay.error : <span>Add Story</span>}
              </button>
            </div>
          </form>
        </section>
        <section className='mx-2'>
          <ul>
            {userStories.map((story, index) => {
              return (
                <li key={index} className='flex justify-between'>
                  <h3>{story.content}</h3>
                  <span>
                    <img
                      onClick={() => deleteUserStory(story)}
                      className='w-5 cursor-pointer'
                      src={BinIcon}
                      alt='delete user story'
                    />
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      </main>
    </>
  );
}

export default UserStories;
