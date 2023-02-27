import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dbClient from '../utils/dbClient.js';
// Components
import { createVerificationInDB } from './utils.js';
// Emitters
import { myEmitterUsers } from '../event/userEvents.js';
import { myEmitterErrors } from '../event/errorEvents.js';
import { findAllUsers, findUserByEmail, createUser, findVerification } from '../domain/users.js';
import { createAccessToken } from '../utils/tokens.js';
import { sendVerificationEmail } from '../utils/sendEmail.js'
// Response messages
import { sendDataResponse, sendMessageResponse } from '../utils/responses.js';
import {
  NotFoundEvent,
  ServerErrorEvent,
  MissingFieldEvent,
  RegistrationServerErrorEvent,
} from '../event/utils/errorUtils.js';
// Time
import { v4 as uuid } from 'uuid';
// Password hash
const hashRate = 8;

export const getAllUsers = async (req, res) => {
  try {
    // Find all users
    const foundUsers = await findAllUsers();

    // If no found users
    if (!foundUsers) {
      // Create error instance
      const notFound = new NotFoundEvent(
        req.user,
        'Not found event',
        'User database'
      );
      myEmitterErrors.emit('error', notFound);
      // Send response
      return sendMessageResponse(res, notFound.code, notFound.message);
    }

    // Connect to eventEmitter
    myEmitterUsers.emit('get-all-users');
    return sendDataResponse(res, 200, { users: foundUsers });
    //
  } catch (err) {
    // Create error instance
    const serverError = new ServerErrorEvent(req.user, `Get all users`);
    // Store error as event
    myEmitterErrors.emit('error', serverError);
    // Send error to client
    sendMessageResponse(res, serverError.code, serverError.message);
    throw err;
  }
};

export const registerNewUser = async (req, res) => {
  const { email, password, role } = req.body;
  const lowerCaseEmail = email.toLowerCase();
  //
  try {
    //
    if (!lowerCaseEmail || !password) {
      //
      const missingField = new MissingFieldEvent(
        null,
        'Registration: Missing Field/s event'
      );
      myEmitterErrors.emit('error', missingField);
      return sendMessageResponse(res, missingField.code, missingField.message);
    }

    const foundUser = await findUserByEmail(lowerCaseEmail);
    if (foundUser) {
      return sendDataResponse(res, 400, { email: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, hashRate);
    const createdUser = await createUser(lowerCaseEmail, hashedPassword, role);

    myEmitterUsers.emit('register', createdUser);

    const uniqueString = uuid() + createdUser.id;
    const hashedString = await bcrypt.hash(uniqueString, hashRate);
    console.log('uniqueString', uniqueString);

    console.log('hashedString', hashedString);

    await createVerificationInDB(createdUser.id, hashedString);
    console.log(
      'link',
      `http://localhost:4000/verify/${createdUser.id}/${uniqueString}`
    );
    console.log('id', createdUser.id);
    await sendVerificationEmail(createdUser.id, createdUser.email, uniqueString)

    return sendDataResponse(res, 201, { createdUser });
  } catch (err) {
    // Create error instance
    const serverError = new RegistrationServerErrorEvent(
      `Register Server error`
    );
    // Store error as event
    myEmitterErrors.emit('error', serverError);
    // Send error to client
    sendMessageResponse(res, serverError.code, serverError.message);
    throw err;
  }
};

export const verifyUser = async (req, res) => {
  console.log('AAAAAAAAAAAA');
  const { userId, uniqueString } = req.params;
  console.log('stuff', userId, uniqueString);
  try {
    // check if the verification record exists
    const foundVerification = await findVerification(userId)
    console.log('found', foundVerification);

    if (!foundVerification) {
      return sendMessageResponse(
        res,
        404,
        "Account record doesn't exist or has been verified already. Please sign up or log in."
      )
    }

    const { expiresAt } = foundVerification
    if (expiresAt < Date.now()) {
      await dbClient.userVerification.delete({ where: { userId } })
      await dbClient.user.delete({ where: { userId } })
      return sendMessageResponse(res, 401, 'Link has expired. Please sign up again.')
    }

    // Returns true
    const isValidString = await bcrypt.compare(uniqueString, foundVerification.uniqueString)
    console.log('IS VALID', isValidString);

    if (!isValidString) {
      return sendMessageResponse(res, 401, 'Invalid verification details passed. Check your inbox.')
    }

    const updatedUser = await dbClient.user.update({
      where: { id: userId },
      data: { isVerified: true },
    })

    delete updatedUser.password
    console.log('updated user', updatedUser);

    const token = createAccessToken(updatedUser.id, updatedUser.email);

    sendDataResponse(res, 200, { token, user: updatedUser })

    await dbClient.userVerification.delete({ where: { userId } })

    myEmitterUsers.emit('verified', updatedUser);

  } catch (err) {
    // Create error instance
    const serverError = new RegistrationServerErrorEvent(
      `Verify New User Server error`
    );
    // Store error as event
    myEmitterErrors.emit('error', serverError);
    // Send error to client
    sendMessageResponse(res, serverError.code, serverError.message);
    throw err;
  }
};
