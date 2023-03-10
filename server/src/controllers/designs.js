// Emitters
import { myEmitterErrors } from '../event/errorEvents.js';
import { myEmitterDesigns } from '../event/designEvents.js';
import {
  findAllDesigns,
  findDesignByName,
  createDesign,
  findDesignById,
  deleteDesignById,
  findUserDesignsById,
  checkFileDoesntExist,
  createNewUserStory,
} from '../domain/designs.js';
import { findUserById } from '../domain/users.js';
// Response messages
import { sendDataResponse, sendMessageResponse } from '../utils/responses.js';
import {
  NotFoundEvent,
  ServerErrorEvent,
  MissingFieldEvent,
  BadRequestEvent,
} from '../event/utils/errorUtils.js';
import { EVENT_MESSAGES } from '../utils/responses.js';
export const getAllDesigns = async (req, res) => {
  console.log('get all designs');
  try {
    const foundDesigns = await findAllDesigns();

    if (!foundDesigns) {
      const notFound = new NotFoundEvent(
        req.user,
        EVENT_MESSAGES.notFound,
        'Designs database'
      );
      myEmitterErrors.emit('error', notFound);
      // Send response
      return sendMessageResponse(res, notFound.code, notFound.message);
    }

    // myEmitterDesigns.emit('get-all-designs', req.user);
    return sendDataResponse(res, 200, { designs: foundDesigns });
  } catch (err) {
    //
    const serverError = new ServerErrorEvent(req.user, `Get all designs`);
    myEmitterErrors.emit('error', serverError);
    sendMessageResponse(res, serverError.code, serverError.message);
    throw err;
  }
};

export const getDesignById = async (req, res) => {
  console.log('DesignById');
  const designId = req.params.designId;

  try {
    const foundDesign = await findDesignById(designId);

    if (!foundDesign) {
      const notFound = new NotFoundEvent(
        req.user,
        EVENT_MESSAGES.notFound,
        'Cant find design by ID'
      );
      myEmitterErrors.emit('error', notFound);
      return sendMessageResponse(res, notFound.code, notFound.message);
    }

    // myEmitterDesigns.emit('get-design-by-id', req.user)
    return sendDataResponse(res, 200, { design: foundDesign });
  } catch (err) {
    //
    const serverError = new ServerErrorEvent(req.user, `Get design by ID`);
    myEmitterErrors.emit('error', serverError);
    sendMessageResponse(res, serverError.code, serverError.message);
    throw err;
  }
};

export const getDesignsFromUser = async (req, res) => {
  console.log('get user id design');
  const userId = req.params.userId;

  try {
    const foundUser = await findUserById(userId);

    if (!foundUser) {
      const notFound = new NotFoundEvent(
        req.user,
        EVENT_MESSAGES.notFound,
        EVENT_MESSAGES.userNotFound
      );
      myEmitterErrors.emit('error', notFound);
      return sendMessageResponse(res, notFound.code, notFound.message);
    }

    const foundDesigns = await findUserDesignsById(userId);

    // myEmitterDesigns.emit('get-user-designs', req.user);
    return sendDataResponse(res, 200, { designs: foundDesigns });
  } catch (err) {
    //
    const serverError = new ServerErrorEvent(
      req.user,
      `Get user designs by ID`
    );
    myEmitterErrors.emit('error', serverError);
    sendMessageResponse(res, serverError.code, serverError.message);
    throw err;
  }
};

export const createNewDesign = async (req, res) => {
  console.log('createNewDesign');
  const { userId, name, colorPalette } = req.body;

  try {
    if (!req.body) {
      const missingField = new MissingFieldEvent(
        null,
        'Design creation: Missing Field/s event'
      );
      myEmitterErrors.emit('error', missingField);
      return sendMessageResponse(res, missingField.code, missingField.message);
    }

    const foundDesign = await checkFileDoesntExist(name, userId);

    if (foundDesign) {
      return sendDataResponse(res, 400, {
        design: 'Design name already exists',
      });
    }

    const foundUser = await findUserById(userId);

    if (!foundUser) {
      const notFound = new NotFoundEvent(
        req.user,
        EVENT_MESSAGES.notFound,
        'Cant find user, design create'
      );
      myEmitterErrors.emit('error', notFound);
      return sendMessageResponse(res, notFound.code, notFound.message);
    }

    const createdDesign = await createDesign(userId, name, colorPalette);

    if (!createdDesign) {
      const notCreated = new BadRequestEvent(
        req.user,
        EVENT_MESSAGES.notFound,
        'Cant create design for user'
      );
      myEmitterErrors.emit('error', notCreated);
      return sendMessageResponse(res, notCreated.code, notCreated.message);
    }

    // myEmitterDesigns.emit('create-design', createdDesign);
    return sendDataResponse(res, 201, { createdDesign });
  } catch (err) {
    //
    const serverError = new ServerErrorEvent(req.user, `Create new design`);
    myEmitterErrors.emit('error', serverError);
    sendMessageResponse(res, serverError.code, serverError.message);
    throw err;
  }
};

export const saveDesign = async (req, res) => {
  console.log('SAVE');
  const { id, userStories } = req.body;
  console.log('id: ', userStories);

  try {
    const foundDesign = await findDesignById(id);
    console.log('foundDesign: ', foundDesign);
    if (!foundDesign) {
      const notFound = new NotFoundEvent(
        req.user,
        EVENT_MESSAGES.notFound,
        EVENT_MESSAGES.designNotFound
      );
      myEmitterErrors.emit('error', notFound);
      return sendMessageResponse(res, notFound.code, notFound.message);
    }

    if (userStories) {
      console.log('AAAA');
      userStories.forEach((story) => {
        console.log('story: ', story);
        console.log('foundDesign.userStories', foundDesign);
        if (foundDesign.userStories) {
          foundDesign.userStories.forEach(async (design) => {
            if (design.content !== story.content) {
              const newStory = await createNewUserStory(story);
              console.log('newStory: ', newStory);
            } else {
              const invalid = new BadRequestEvent(
                req.user,
                EVENT_MESSAGES.designTag,
                'User story already exists'
              );
              myEmitterErrors.emit('error', invalid);
              return sendMessageResponse(res, invalid.code, invalid.message);
            }
          });
        } else {
          userStories.forEach(async (story) => {
            console.log('new story: ', story);
            const newStory = await createNewUserStory(story);
            console.log('SS new story: ', newStory);
          })
        }
      });
    }

    // myEmitterDesigns.emit('get-design-by-id', req.user)
    return sendDataResponse(res, 200, { design: foundDesign });
  } catch (err) {
    //
    const serverError = new ServerErrorEvent(req.user, `Get design by ID`);
    myEmitterErrors.emit('error', serverError);
    sendMessageResponse(res, serverError.code, serverError.message);
    throw err;
  }
};

export const deleteDesign = async (req, res) => {
  console.log('deleteDesign');
  const designId = req.params.designId;

  try {
    const foundDesign = await findDesignById(designId);

    if (!foundDesign) {
      const notFound = new NotFoundEvent(
        req.user,
        'Not found design',
        'Event database'
      );
      myEmitterErrors.emit('error', notFound);
      return sendMessageResponse(res, notFound.code, notFound.message);
    }

    await deleteDesignById(designId);
    myEmitterDesigns.emit('deleted-design', req.user);
    return sendDataResponse(res, 200, {
      design: foundDesign,
      message: `Design ${foundDesign.name} deleted`,
    });
  } catch (err) {
    //
    const serverError = new ServerErrorEvent(req.user, `Delete design`);
    myEmitterErrors.emit('error', serverError);
    sendMessageResponse(res, serverError.code, serverError.message);
    throw err;
  }
};
