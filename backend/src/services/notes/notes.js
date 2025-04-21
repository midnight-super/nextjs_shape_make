// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  notesDataValidator,
  notesPatchValidator,
  notesQueryValidator,
  notesResolver,
  notesExternalResolver,
  notesDataResolver,
  notesPatchResolver,
  notesQueryResolver
} from './notes.schema.js'
import { NotesService, getOptions } from './notes.class.js'

export * from './notes.class.js'
export * from './notes.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const notes = (app) => {
  // Register our service on the Feathers application
  app.use('notes', new NotesService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: ['find', 'get', 'create', 'patch', 'remove'],
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service('notes').hooks({
    around: {
      all: [schemaHooks.resolveExternal(notesExternalResolver), schemaHooks.resolveResult(notesResolver)]
    },
    before: {
      all: [schemaHooks.validateQuery(notesQueryValidator), schemaHooks.resolveQuery(notesQueryResolver)],
      find: [],
      get: [],
      create: [schemaHooks.validateData(notesDataValidator), schemaHooks.resolveData(notesDataResolver)],
      patch: [schemaHooks.validateData(notesPatchValidator), schemaHooks.resolveData(notesPatchResolver)],
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
