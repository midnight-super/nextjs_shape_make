// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const organisationsSchema = {
  $id: 'Organisations',
  type: 'object',
  additionalProperties: true,
  required: ['_id', 'name'],
  properties: {
    _id: {
      type: 'string'
    },
    name: {
      type: 'string'
    }
  }
}
export const organisationsResolver = resolve({})
export const organisationsExternalResolver = resolve({})

// Schema for creating new data
export const organisationsDataSchema = {
  $id: 'OrganisationsData',
  type: 'object',
  additionalProperties: true,
  required: ['name'],
  properties: {
    name: {
      type: 'string'
    }
  }
}
export const organisationsDataValidator = getValidator(organisationsDataSchema, dataValidator)
export const organisationsDataResolver = resolve({})

// Schema for updating existing data
export const organisationsPatchSchema = {
  $id: 'OrganisationsPatch',
  type: 'object',
  additionalProperties: true,
  required: [],
  properties: {
    ...organisationsSchema.properties
  }
}
export const organisationsPatchValidator = getValidator(organisationsPatchSchema, dataValidator)
export const organisationsPatchResolver = resolve({})

// Schema for allowed query properties
export const organisationsQuerySchema = {
  $id: 'OrganisationsQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(organisationsSchema.properties)
  }
}
export const organisationsQueryValidator = getValidator(organisationsQuerySchema, queryValidator)
export const organisationsQueryResolver = resolve({})
