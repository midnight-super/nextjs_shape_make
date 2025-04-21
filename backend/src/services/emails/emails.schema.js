// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const emailsSchema = {
  $id: 'Emails',
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
export const emailsResolver = resolve({})
export const emailsExternalResolver = resolve({})

// Schema for creating new data
export const emailsDataSchema = {
  $id: 'EmailsData',
  type: 'object',
  additionalProperties: true,
  required: [],
  properties: {
    text: {
      type: 'string'
    }
  }
}
export const emailsDataValidator = getValidator(emailsDataSchema, dataValidator)
export const emailsDataResolver = resolve({})

// Schema for updating existing data
export const emailsPatchSchema = {
  $id: 'EmailsPatch',
  type: 'object',
  additionalProperties: true,
  required: [],
  properties: {
    ...emailsSchema.properties
  }
}
export const emailsPatchValidator = getValidator(emailsPatchSchema, dataValidator)
export const emailsPatchResolver = resolve({})

// Schema for allowed query properties
export const emailsQuerySchema = {
  $id: 'EmailsQuery',
  type: 'object',
  additionalProperties: true,
  properties: {
    ...querySyntax(emailsSchema.properties)
  }
}
export const emailsQueryValidator = getValidator(emailsQuerySchema, queryValidator)
export const emailsQueryResolver = resolve({})
