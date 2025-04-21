// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  notificationsDataValidator,
  notificationsPatchValidator,
  notificationsQueryValidator,
  notificationsResolver,
  notificationsExternalResolver,
  notificationsDataResolver,
  notificationsPatchResolver,
  notificationsQueryResolver
} from './notifications.schema.js'
import { NotificationsService, getOptions } from './notifications.class.js'

export * from './notifications.class.js'
export * from './notifications.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const notifications = (app) => {
  // Register our service on the Feathers application
  app.use('notifications', new NotificationsService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: ['find', 'get', 'create', 'patch', 'remove'],
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service('notifications').hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(notificationsExternalResolver),
        schemaHooks.resolveResult(notificationsResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(notificationsQueryValidator),
        schemaHooks.resolveQuery(notificationsQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(notificationsDataValidator),
        schemaHooks.resolveData(notificationsDataResolver)
      ],
      patch: [
        schemaHooks.validateData(notificationsPatchValidator),
        schemaHooks.resolveData(notificationsPatchResolver)
      ],
      remove: []
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
}
