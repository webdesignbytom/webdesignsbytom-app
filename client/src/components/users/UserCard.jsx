import React from 'react';

function UserCard({ user }) {
  console.log('XXX USER', user);
  const { email, firstName, lastName, country } = user;
  return (
    <>
      <section className='mx-2 border-2 border-black border-solid rounded-md p-2'>
        <div>IMG</div>
        <article>
          <p>{email}</p>
          <p>{firstName}</p>
          <p>{lastName}</p>
          <p>{country}</p>
        </article>
      </section>
      <section className='m-2'>
        <button className='bg-main-colour p-2 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-main-colour-med hover:shadow-lg focus:bg-main-colour-med focus:shadow-lg focus:outline-none focus:ring-0 active:bg-main-colour-dark active:shadow-lg transition duration-150 ease-in-out w-full'>
          Update Profile
        </button>
      </section>
    </>
  );
}

export default UserCard;
