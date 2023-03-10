import { myEmitter } from '../utils/eventEmitter.js';
import {
  createGetAllComponentsEvent,
  createCreateComponentEvent,
  createDeleteComponentEvent,
} from './utils/componentUtils.js';

export const myEmitterComponents = myEmitter;

myEmitterComponents.on('get-all-components', async (user) =>
  createGetAllComponentsEvent(user)
);

myEmitterComponents.on('create-component', async (user) =>
  createCreateComponentEvent(user)
);

myEmitterComponents.on('deleted-component', async (user) =>
  createDeleteComponentEvent(user)
);
