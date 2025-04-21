// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const opportunitiesSchema = {
  $id: 'Opportunities',
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
export const opportunitiesResolver = resolve({})
export const opportunitiesExternalResolver = resolve({})

// Schema for creating new data
export const opportunitiesDataSchema = {
  $id: 'OpportunitiesData',
  type: 'object',
  additionalProperties: true,
  required: [],
  properties: {
    text: {
      type: 'string'
    }
  }
}
export const opportunitiesDataValidator = getValidator(opportunitiesDataSchema, dataValidator)
export const opportunitiesDataResolver = resolve({})

// Schema for updating existing data
export const opportunitiesPatchSchema = {
  $id: 'OpportunitiesPatch',
  type: 'object',
  additionalProperties: true,
  required: [],
  properties: {
    ...opportunitiesSchema.properties
  }
}
export const opportunitiesPatchValidator = getValidator(opportunitiesPatchSchema, dataValidator)
export const opportunitiesPatchResolver = resolve({})

// Schema for allowed query properties
export const opportunitiesQuerySchema = {
  $id: 'OpportunitiesQuery',
  type: 'object',
  additionalProperties: true,
  properties: {
    ...querySyntax(opportunitiesSchema.properties)
  }
}
export const opportunitiesQueryValidator = getValidator(opportunitiesQuerySchema, queryValidator)
export const opportunitiesQueryResolver = resolve({})
