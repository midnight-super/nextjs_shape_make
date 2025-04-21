// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  opportunitiesDataValidator,
  opportunitiesPatchValidator,
  opportunitiesQueryValidator,
  opportunitiesResolver,
  opportunitiesExternalResolver,
  opportunitiesDataResolver,
  opportunitiesPatchResolver,
  opportunitiesQueryResolver
} from './opportunities.schema.js'
import { OpportunitiesService, getOptions } from './opportunities.class.js'

export * from './opportunities.class.js'
export * from './opportunities.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const opportunities = (app) => {
  // Register our service on the Feathers application
  app.use('opportunities', new OpportunitiesService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: ['find', 'get', 'create', 'patch', 'remove'],
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service('opportunities').hooks({
    around: {
      all: [
        // authenticate('jwt'),
        schemaHooks.resolveExternal(opportunitiesExternalResolver),
        schemaHooks.resolveResult(opportunitiesResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(opportunitiesQueryValidator),
        schemaHooks.resolveQuery(opportunitiesQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(opportunitiesDataValidator),
        schemaHooks.resolveData(opportunitiesDataResolver)
      ],
      patch: [
        schemaHooks.validateData(opportunitiesPatchValidator),
        schemaHooks.resolveData(opportunitiesPatchResolver)
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
