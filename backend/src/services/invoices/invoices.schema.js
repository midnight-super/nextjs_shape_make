// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const invoicesSchema = {
  $id: 'Invoices',
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
export const invoicesResolver = resolve({})
export const invoicesExternalResolver = resolve({})

// Schema for creating new data
export const invoicesDataSchema = {
  $id: 'InvoicesData',
  type: 'object',
  additionalProperties: true,
  required: [],
  properties: {
    text: {
      type: 'string'
    }
  }
}
export const invoicesDataValidator = getValidator(invoicesDataSchema, dataValidator)
export const invoicesDataResolver = resolve({})

// Schema for updating existing data
export const invoicesPatchSchema = {
  $id: 'InvoicesPatch',
  type: 'object',
  additionalProperties: true,
  required: [],
  properties: {
    ...invoicesSchema.properties
  }
}
export const invoicesPatchValidator = getValidator(invoicesPatchSchema, dataValidator)
export const invoicesPatchResolver = resolve({})

// Schema for allowed query properties
export const invoicesQuerySchema = {
  $id: 'InvoicesQuery',
  type: 'object',
  additionalProperties: true,
  properties: {
    ...querySyntax(invoicesSchema.properties)
  }
}
export const invoicesQueryValidator = getValidator(invoicesQuerySchema, queryValidator)
export const invoicesQueryResolver = resolve({})
