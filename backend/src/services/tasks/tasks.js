// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  tasksDataValidator,
  tasksPatchValidator,
  tasksQueryValidator,
  tasksResolver,
  tasksExternalResolver,
  tasksDataResolver,
  tasksPatchResolver,
  tasksQueryResolver
} from './tasks.schema.js'
import { TasksService, getOptions } from './tasks.class.js'

export * from './tasks.class.js'
export * from './tasks.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const tasks = (app) => {
  // Register our service on the Feathers application
  app.use('tasks', new TasksService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: ['find', 'get', 'create', 'patch', 'remove'],
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service('tasks').hooks({
    around: {
      all: [schemaHooks.resolveExternal(tasksExternalResolver), schemaHooks.resolveResult(tasksResolver)]
    },
    before: {
      all: [schemaHooks.validateQuery(tasksQueryValidator), schemaHooks.resolveQuery(tasksQueryResolver)],
      find: [],
      get: [],
      create: [schemaHooks.validateData(tasksDataValidator), schemaHooks.resolveData(tasksDataResolver)],
      patch: [schemaHooks.validateData(tasksPatchValidator), schemaHooks.resolveData(tasksPatchResolver)],
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
