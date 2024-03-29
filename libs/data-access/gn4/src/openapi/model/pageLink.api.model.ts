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
import { SortApiModel } from './sort.api.model'
import { PageableApiModel } from './pageable.api.model'
import { LinkApiModel } from './link.api.model'

export interface PageLinkApiModel {
  totalPages?: number
  totalElements?: number
  numberOfElements?: number
  pageable?: PageableApiModel
  number?: number
  sort?: SortApiModel
  first?: boolean
  last?: boolean
  size?: number
  content?: Array<LinkApiModel>
  empty?: boolean
}
