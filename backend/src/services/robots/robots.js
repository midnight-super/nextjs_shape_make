// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  robotsDataValidator,
  robotsPatchValidator,
  robotsQueryValidator,
  robotsResolver,
  robotsExternalResolver,
  robotsDataResolver,
  robotsPatchResolver,
  robotsQueryResolver
} from './robots.schema.js'
import { RobotsService, getOptions } from './robots.class.js'
import { testHook } from '../../hooks/test-hook.js'

export * from './robots.class.js'
export * from './robots.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const robots = (app) => {
  // Register our service on the Feathers application
  app.use('robots', new RobotsService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: ['find', 'get', 'create', 'patch', 'remove'],
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service('robots').hooks({
    around: {
      all: [schemaHooks.resolveExternal(robotsExternalResolver), schemaHooks.resolveResult(robotsResolver)]
    },
    before: {
      all: [testHook, schemaHooks.validateQuery(robotsQueryValidator), schemaHooks.resolveQuery(robotsQueryResolver)],
      find: [],
      get: [],
      create: [schemaHooks.validateData(robotsDataValidator), schemaHooks.resolveData(robotsDataResolver)],
      patch: [schemaHooks.validateData(robotsPatchValidator), schemaHooks.resolveData(robotsPatchResolver)],
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
