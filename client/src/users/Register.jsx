import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Components
import { Navbar } from '../components/nav/Navbar';
// Data
import { registerDataTemplate, registerFormResponses } from './utils/utils';
// Axios
import client from '../utils/client';
// Select
import CountrySelect from './utils/CountrySelect';
// Validation
import { validPassword } from './utils/Validation';

function Register() {
  const [registerForm, setRegisterForm] = useState(registerDataTemplate);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [successRegisterUser, setSuccessRegisterUser] = useState('');
  const [formResponses, setFormResponses] = useState(registerFormResponses);

  console.log('formResponses', formResponses);
  let navigate = useNavigate();

  const login = () => {
    navigate('../login', { replace: true });
  };

  console.log('register', registerForm);

  const checkHandler = (event) => {
    setAgreedToTerms(!agreedToTerms);
    setRegisterForm({
      ...registerForm,
      agreedToTerms: !agreedToTerms,
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (registerForm.password.length > 8) {
      setFormResponses({
        ...formResponses,
        passwordLengthError: false,
      });
    } else {
      setFormResponses({
        ...formResponses,
        passwordLengthError: true,
      });
    }

    setRegisterForm({
      ...registerForm,
      [name]: value,
    });
  };

  const handleRegister = (event) => {
    event.preventDefault();
    console.log('xxx');
    console.log('submitting');

    if (registerForm.password !== registerForm.confirmPassword) {
      alert('Passwords do not match');
      setFormResponses({
        ...formResponses,
        passwordMatchError: true,
      });
      return;
    }

    const checkPassword = validPassword(registerForm.password);
    console.log('checkPassword', checkPassword);

    if (checkPassword === false) {
      alert('Passwords too short');
      setFormResponses({
        ...formResponses,
        passwordLengthError: true,
      });
      return;
    }

    if (agreedToTerms !== true) {
      alert('Please check to agree to terms and conditons');
      setFormResponses({
        ...formResponses,
        agreedToTermsError: true,
      });
      return;
    }

    setFormResponses({
      passwordMatchError: true,
      passwordLengthError: true,
      agreedToTermsError: true,
    });

    const userData = registerForm;

    client
      .post('/users/register', userData, false)
      .then((res) => {
        setSuccessRegisterUser(res.data.data.createdUser.email);
        console.log('data', res.data);
      })
      .then(() => login())
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <>
      <div className='bg-white dark:bg-black h-screen'>
        <div className='h-screen grid'>
          <Navbar />
          <article className='hidden lg:block text-main-colour text-center text-6xl font-extrabold'>
            <h1>webdesignsbytom</h1>
            <div className='font-extrabold text-4xl text-center py-4 md:pb-6'>
              <h2 className='my-4'>REGISTER</h2>
            </div>
          </article>
          <section className='dark:bg-black grid justify-center'>
            <div className='container px-6 py-6 h-full'>
              <div className='flex justify-center items-center flex-wrap h-full g-6 text-gray-800 lg:mb-6'>
                <div className='flex flex-col lg:pl-12 md:w-8/12 lg:w-6/12 mb-12 md:mb-0'>
                  <div>
                    <img
                      src='https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg'
                      className='w-full lg:w-eighty'
                      alt='Phone'
                    />
                  </div>
                </div>
                <section className='md:w-8/12 lg:w-5/12 lg:ml-20'>
                  <form onSubmit={handleRegister}>
                    {/* <!-- Email input --> */}
                    <div className='mb-6'>
                      <input
                        type='text'
                        name='email'
                        className='form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-main-colour focus:outline-none'
                        placeholder='Email address'
                        onChange={handleChange}
                      />
                    </div>

                    {/* <!-- Password input --> */}
                    <div className='mb-6'>
                      <input
                        type='password'
                        name='password'
                        className='form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-main-colour focus:outline-none'
                        placeholder='Password'
                        onChange={handleChange}
                      />
                    </div>

                    {/* <!--Confirm Password input --> */}
                    <div className='mb-6'>
                      <input
                        type='password'
                        name='confirmPassword'
                        className='form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-main-colour focus:outline-none'
                        placeholder='Confirm Password'
                        onChange={handleChange}
                      />
                    </div>

                    {/* <!-- FirstName input --> */}
                    <div className='mb-6'>
                      <input
                        type='text'
                        name='firstName'
                        className='form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-main-colour focus:outline-none'
                        placeholder='First Name'
                        onChange={handleChange}
                      />
                    </div>

                    {/* <!-- LastName input --> */}
                    <div className='mb-6'>
                      <input
                        type='text'
                        name='lastName'
                        className='form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-main-colour focus:outline-none'
                        placeholder='Last Name'
                        onChange={handleChange}
                      />
                    </div>

                    {/* <!-- Country input --> */}
                    <div className='mb-4'>
                      <CountrySelect handleChange={handleChange} />
                    </div>

                    <div className='flex h-auto mb-2'>
                      <input
                        type='checkbox'
                        name='agreedToTerms'
                        className='form-check-input border-solid appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-main-colour checked:border-gray-900 focus:outline-none transition duration-200 bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer'
                        id='agreedToTerms'
                        checked={agreedToTerms}
                        value={agreedToTerms}
                        onChange={checkHandler}
                      />
                      <label
                        htmlFor='link-checkbox'
                        className='ml-2 text-sm font-medium text-gray-900 dark:text-gray-300 align-top'
                      >
                        I agree with the{' '}
                        <Link
                          to='/terms-and-conditions'
                          className='text-blue-600 dark:text-blue-500 hover:underline'
                        >
                          terms and conditions
                        </Link>
                        .
                      </label>
                    </div>

                    {/* Hidden password missing links */}
                    {formResponses.passwordLengthError && (
                      <div>Password too short</div>
                    )}
                    {formResponses.passwordMatchError && (
                      <div>Password doesnt match</div>
                    )}

                    {/* <!-- Submit button --> */}
                    {successRegisterUser ? (
                      <p>{successRegisterUser}</p>
                    ) : (
                      <div className='mb-2'>
                        <button
                          type='submit'
                          className='inline-block px-7 py-3 bg-main-colour text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-colour-med hover:shadow-lg focus:bg-eco-green-med focus:shadow-lg focus:outline-none focus:ring-0 active:bg-main-dark active:shadow-lg transition duration-150 ease-in-out w-full'
                          data-mdb-ripple='true'
                          data-mdb-ripple-color='light'
                        >
                          Register
                        </button>
                      </div>
                    )}
                    <div className='mb-6 text-center'>
                      <Link to='/login'>
                        <p>Already a member? Click here to login</p>
                      </Link>
                    </div>
                  </form>
                </section>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default Register;
