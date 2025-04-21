// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const jobsSchema = {
  $id: 'Jobs',
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
export const jobsResolver = resolve({})
export const jobsExternalResolver = resolve({})

// Schema for creating new data
export const jobsDataSchema = {
  $id: 'JobsData',
  type: 'object',
  additionalProperties: true,
  required: [],
  properties: {
    text: {
      type: 'string'
    }
  }
}
export const jobsDataValidator = getValidator(jobsDataSchema, dataValidator)
export const jobsDataResolver = resolve({})

// Schema for updating existing data
export const jobsPatchSchema = {
  $id: 'JobsPatch',
  type: 'object',
  additionalProperties: true,
  required: [],
  properties: {
    ...jobsSchema.properties
  }
}
export const jobsPatchValidator = getValidator(jobsPatchSchema, dataValidator)
export const jobsPatchResolver = resolve({})

// Schema for allowed query properties
export const jobsQuerySchema = {
  $id: 'JobsQuery',
  type: 'object',
  additionalProperties: true,
  properties: {
    ...querySyntax(jobsSchema.properties)
  }
}
export const jobsQueryValidator = getValidator(jobsQuerySchema, queryValidator)
export const jobsQueryResolver = resolve({})
