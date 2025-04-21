// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const designsSchema = {
  $id: 'Designs',
  type: 'object',
  additionalProperties: false,
  required: ['_id', 'text'],
  properties: {
    _id: {
      type: 'string'
    },
    text: {
      type: 'string'
    }
  }
}
export const designsResolver = resolve({})
export const designsExternalResolver = resolve({})

// const PolygonSchema = new Schema({

// })

// Schema for creating new data
export const designsDataSchema = {
  $id: 'DesignsData',
  type: 'object',
  additionalProperties: false,
  required: [
    // 'text'
  ],
  properties: {
    text: {
      type: 'string'
    },
    designName: {
      type: 'string'
    },
    owerId: {
      type: 'string'
    },
    polygons: {
      type: 'array'
      // properties: {
      //   points: {
      //     type: 'array'
      //   },
      //   lines: {
      //     type: 'array'
      //   }
      // }
    }
  }
}
export const designsDataValidator = getValidator(designsDataSchema, dataValidator)
export const designsDataResolver = resolve({})

// Schema for updating existing data
export const designsPatchSchema = {
  $id: 'DesignsPatch',
  type: 'object',
  // additionalProperties: false,
  additionalProperties: true,
  required: [],
  properties: {
    ...designsSchema.properties
  }
}
export const designsPatchValidator = getValidator(designsPatchSchema, dataValidator)
export const designsPatchResolver = resolve({})

// Schema for allowed query properties
export const designsQuerySchema = {
  $id: 'DesignsQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(designsSchema.properties)
  }
}
export const designsQueryValidator = getValidator(designsQuerySchema, queryValidator)
export const designsQueryResolver = resolve({})
