// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  organisationsDataValidator,
  organisationsPatchValidator,
  organisationsQueryValidator,
  organisationsResolver,
  organisationsExternalResolver,
  organisationsDataResolver,
  organisationsPatchResolver,
  organisationsQueryResolver
} from './organisations.schema.js'
import { OrganisationsService, getOptions } from './organisations.class.js'

export * from './organisations.class.js'
export * from './organisations.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const organisations = (app) => {
  // Register our service on the Feathers application
  app.use('organisations', new OrganisationsService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: ['find', 'get', 'create', 'patch', 'remove'],
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service('organisations').hooks({
    around: {
      all: [
        // authenticate('jwt'),
        schemaHooks.resolveExternal(organisationsExternalResolver),
        schemaHooks.resolveResult(organisationsResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(organisationsQueryValidator),
        schemaHooks.resolveQuery(organisationsQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(organisationsDataValidator),
        schemaHooks.resolveData(organisationsDataResolver)
      ],
      patch: [
        schemaHooks.validateData(organisationsPatchValidator),
        schemaHooks.resolveData(organisationsPatchResolver)
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
