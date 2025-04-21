// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const supportTicketsSchema = {
  $id: 'SupportTickets',
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
export const supportTicketsResolver = resolve({})
export const supportTicketsExternalResolver = resolve({})

// Schema for creating new data
export const supportTicketsDataSchema = {
  $id: 'SupportTicketsData',
  type: 'object',
  additionalProperties: true,
  required: [],
  properties: {
    text: {
      type: 'string'
    }
  }
}
export const supportTicketsDataValidator = getValidator(supportTicketsDataSchema, dataValidator)
export const supportTicketsDataResolver = resolve({})

// Schema for updating existing data
export const supportTicketsPatchSchema = {
  $id: 'SupportTicketsPatch',
  type: 'object',
  additionalProperties: true,
  required: [],
  properties: {
    ...supportTicketsSchema.properties
  }
}
export const supportTicketsPatchValidator = getValidator(supportTicketsPatchSchema, dataValidator)
export const supportTicketsPatchResolver = resolve({})

// Schema for allowed query properties
export const supportTicketsQuerySchema = {
  $id: 'SupportTicketsQuery',
  type: 'object',
  additionalProperties: true,
  properties: {
    ...querySyntax(supportTicketsSchema.properties)
  }
}
export const supportTicketsQueryValidator = getValidator(supportTicketsQuerySchema, queryValidator)
export const supportTicketsQueryResolver = resolve({})
