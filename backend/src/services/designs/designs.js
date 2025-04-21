// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  designsDataValidator,
  designsPatchValidator,
  designsQueryValidator,
  designsResolver,
  designsExternalResolver,
  designsDataResolver,
  designsPatchResolver,
  designsQueryResolver
} from './designs.schema.js'
import { DesignsService, getOptions } from './designs.class.js'

export * from './designs.class.js'
export * from './designs.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const designs = (app) => {
  // Register our service on the Feathers application
  app.use('designs', new DesignsService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: ['find', 'get', 'create', 'patch', 'remove'],
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service('designs').hooks({
    around: {
      all: [
        // authenticate('jwt'),
        // schemaHooks.resolveExternal(designsExternalResolver),
        // schemaHooks.resolveResult(designsResolver)
      ]
    },
    before: {
      all: [schemaHooks.validateQuery(designsQueryValidator), schemaHooks.resolveQuery(designsQueryResolver)],
      find: [],
      get: [],
      create: [schemaHooks.validateData(designsDataValidator), schemaHooks.resolveData(designsDataResolver)],
      patch: [schemaHooks.validateData(designsPatchValidator), schemaHooks.resolveData(designsPatchResolver)],
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
