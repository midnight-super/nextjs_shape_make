// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  invoicesDataValidator,
  invoicesPatchValidator,
  invoicesQueryValidator,
  invoicesResolver,
  invoicesExternalResolver,
  invoicesDataResolver,
  invoicesPatchResolver,
  invoicesQueryResolver
} from './invoices.schema.js'
import { InvoicesService, getOptions } from './invoices.class.js'

export * from './invoices.class.js'
export * from './invoices.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const invoices = (app) => {
  // Register our service on the Feathers application
  app.use('invoices', new InvoicesService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: ['find', 'get', 'create', 'patch', 'remove'],
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service('invoices').hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(invoicesExternalResolver),
        schemaHooks.resolveResult(invoicesResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(invoicesQueryValidator),
        schemaHooks.resolveQuery(invoicesQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(invoicesDataValidator),
        schemaHooks.resolveData(invoicesDataResolver)
      ],
      patch: [
        schemaHooks.validateData(invoicesPatchValidator),
        schemaHooks.resolveData(invoicesPatchResolver)
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
