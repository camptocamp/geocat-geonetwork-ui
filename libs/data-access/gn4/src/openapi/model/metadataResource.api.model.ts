/**
 * GeoNetwork 4.2.7 OpenAPI Documentation
 * This is the description of the GeoNetwork OpenAPI. Use this API to manage your catalog.
 *
 * The version of the OpenAPI document: 4.2.7
 * Contact: geonetwork-users@lists.sourceforge.net
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { MetadataResourceExternalManagementPropertiesApiModel } from './metadataResourceExternalManagementProperties.api.model'

export interface MetadataResourceApiModel {
  metadataId?: number
  metadataUuid?: string
  approved?: boolean
  visibility?: MetadataResourceApiModel.VisibilityEnum
  metadataResourceExternalManagementProperties?: MetadataResourceExternalManagementPropertiesApiModel
  lastModification?: string
  version?: string
  url?: string
  filename?: string
  id?: string
  size?: number
}
export namespace MetadataResourceApiModel {
  export type VisibilityEnum = 'public' | 'private'
  export const VisibilityEnum = {
    Public: 'public' as VisibilityEnum,
    Private: 'private' as VisibilityEnum,
  }
}
