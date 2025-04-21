// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  supportTicketsDataValidator,
  supportTicketsPatchValidator,
  supportTicketsQueryValidator,
  supportTicketsResolver,
  supportTicketsExternalResolver,
  supportTicketsDataResolver,
  supportTicketsPatchResolver,
  supportTicketsQueryResolver
} from './support-tickets.schema.js'
import { SupportTicketsService, getOptions } from './support-tickets.class.js'

export * from './support-tickets.class.js'
export * from './support-tickets.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const supportTickets = (app) => {
  // Register our service on the Feathers application
  app.use('support-tickets', new SupportTicketsService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: ['find', 'get', 'create', 'patch', 'remove'],
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service('support-tickets').hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(supportTicketsExternalResolver),
        schemaHooks.resolveResult(supportTicketsResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(supportTicketsQueryValidator),
        schemaHooks.resolveQuery(supportTicketsQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(supportTicketsDataValidator),
        schemaHooks.resolveData(supportTicketsDataResolver)
      ],
      patch: [
        schemaHooks.validateData(supportTicketsPatchValidator),
        schemaHooks.resolveData(supportTicketsPatchResolver)
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
