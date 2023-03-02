import dbClient from '../utils/dbClient.js';

export const findAllNotifications = () => dbClient.notification.findMany({});

export const findNotificationsByUserId = (userId) =>
    dbClient.notification.findMany({
        where: {
            userId: userId,
        }
    })

export const createNewNotification = (type, content, userId) =>
    dbClient.notification.create({
        data: {
            type: type,
            content: content,
            userId: userId
        }
    })
