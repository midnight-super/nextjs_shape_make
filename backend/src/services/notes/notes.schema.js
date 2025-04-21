// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const notesSchema = {
  $id: 'Notes',
  type: 'object',
  additionalProperties: true,
  required: ['_id'],
  properties: {
    _id: {
      type: 'string'
    },
    text: {
      type: 'string'
    }
  }
}
export const notesResolver = resolve({})
export const notesExternalResolver = resolve({})

// Schema for creating new data
export const notesDataSchema = {
  $id: 'NotesData',
  type: 'object',
  additionalProperties: true,
  required: [],
  properties: {
    text: {
      type: 'string'
    }
  }
}
export const notesDataValidator = getValidator(notesDataSchema, dataValidator)
export const notesDataResolver = resolve({})

// Schema for updating existing data
export const notesPatchSchema = {
  $id: 'NotesPatch',
  type: 'object',
  additionalProperties: true,
  required: [],
  properties: {
    ...notesSchema.properties
  }
}
export const notesPatchValidator = getValidator(notesPatchSchema, dataValidator)
export const notesPatchResolver = resolve({})

// Schema for allowed query properties
export const notesQuerySchema = {
  $id: 'NotesQuery',
  type: 'object',
  additionalProperties: true,
  properties: {
    ...querySyntax(notesSchema.properties)
  }
}
export const notesQueryValidator = getValidator(notesQuerySchema, queryValidator)
export const notesQueryResolver = resolve({})
