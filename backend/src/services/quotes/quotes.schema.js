// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const quotesSchema = {
  $id: 'Quotes',
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
export const quotesResolver = resolve({})
export const quotesExternalResolver = resolve({})

// Schema for creating new data
export const quotesDataSchema = {
  $id: 'QuotesData',
  type: 'object',
  additionalProperties: true,
  required: [],
  properties: {
    text: {
      type: 'string'
    }
  }
}
export const quotesDataValidator = getValidator(quotesDataSchema, dataValidator)
export const quotesDataResolver = resolve({})

// Schema for updating existing data
export const quotesPatchSchema = {
  $id: 'QuotesPatch',
  type: 'object',
  additionalProperties: true,
  required: [],
  properties: {
    ...quotesSchema.properties
  }
}
export const quotesPatchValidator = getValidator(quotesPatchSchema, dataValidator)
export const quotesPatchResolver = resolve({})

// Schema for allowed query properties
export const quotesQuerySchema = {
  $id: 'QuotesQuery',
  type: 'object',
  additionalProperties: true,
  properties: {
    ...querySyntax(quotesSchema.properties)
  }
}
export const quotesQueryValidator = getValidator(quotesQuerySchema, queryValidator)
export const quotesQueryResolver = resolve({})
