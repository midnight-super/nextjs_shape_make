// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const tasksSchema = {
  $id: 'Tasks',
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
export const tasksResolver = resolve({})
export const tasksExternalResolver = resolve({})

// Schema for creating new data
export const tasksDataSchema = {
  $id: 'TasksData',
  type: 'object',
  additionalProperties: true,
  required: [],
  properties: {
    text: {
      type: 'string'
    }
  }
}
export const tasksDataValidator = getValidator(tasksDataSchema, dataValidator)
export const tasksDataResolver = resolve({})

// Schema for updating existing data
export const tasksPatchSchema = {
  $id: 'TasksPatch',
  type: 'object',
  additionalProperties: true,
  required: [],
  properties: {
    ...tasksSchema.properties
  }
}
export const tasksPatchValidator = getValidator(tasksPatchSchema, dataValidator)
export const tasksPatchResolver = resolve({})

// Schema for allowed query properties
export const tasksQuerySchema = {
  $id: 'TasksQuery',
  type: 'object',
  additionalProperties: true,
  properties: {
    ...querySyntax(tasksSchema.properties)
  }
}
export const tasksQueryValidator = getValidator(tasksQuerySchema, queryValidator)
export const tasksQueryResolver = resolve({})
