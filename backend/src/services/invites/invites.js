// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  invitesDataValidator,
  invitesPatchValidator,
  invitesQueryValidator,
  invitesResolver,
  invitesExternalResolver,
  invitesDataResolver,
  invitesPatchResolver,
  invitesQueryResolver
} from './invites.schema.js'
import { InvitesService, getOptions } from './invites.class.js'

export * from './invites.class.js'
export * from './invites.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const invites = (app) => {
  // Register our service on the Feathers application
  app.use('invites', new InvitesService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: ['find', 'get', 'create', 'patch', 'remove'],
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service('invites').hooks({
    around: {
      all: [schemaHooks.resolveExternal(invitesExternalResolver), schemaHooks.resolveResult(invitesResolver)]
    },
    before: {
      all: [schemaHooks.validateQuery(invitesQueryValidator), schemaHooks.resolveQuery(invitesQueryResolver)],
      find: [],
      get: [],
      create: [schemaHooks.validateData(invitesDataValidator), schemaHooks.resolveData(invitesDataResolver)],
      patch: [schemaHooks.validateData(invitesPatchValidator), schemaHooks.resolveData(invitesPatchResolver)],
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
