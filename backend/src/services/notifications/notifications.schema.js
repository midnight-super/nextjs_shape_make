// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const notificationsSchema = {
  $id: 'Notifications',
  type: 'object',
  additionalProperties: true,
  required: ['_id'],
  properties: {
    _id: {
      type: 'string'
    },
    text: {
      type: 'string'
    }
  }
}
export const notificationsResolver = resolve({})
export const notificationsExternalResolver = resolve({})

// Schema for creating new data
export const notificationsDataSchema = {
  $id: 'NotificationsData',
  type: 'object',
  additionalProperties: true,
  required: [],
  properties: {
    text: {
      type: 'string'
    }
  }
}
export const notificationsDataValidator = getValidator(notificationsDataSchema, dataValidator)
export const notificationsDataResolver = resolve({})

// Schema for updating existing data
export const notificationsPatchSchema = {
  $id: 'NotificationsPatch',
  type: 'object',
  additionalProperties: true,
  required: [],
  properties: {
    ...notificationsSchema.properties
  }
}
export const notificationsPatchValidator = getValidator(notificationsPatchSchema, dataValidator)
export const notificationsPatchResolver = resolve({})

// Schema for allowed query properties
export const notificationsQuerySchema = {
  $id: 'NotificationsQuery',
  type: 'object',
  additionalProperties: true,
  properties: {
    ...querySyntax(notificationsSchema.properties)
  }
}
export const notificationsQueryValidator = getValidator(notificationsQuerySchema, queryValidator)
export const notificationsQueryResolver = resolve({})
