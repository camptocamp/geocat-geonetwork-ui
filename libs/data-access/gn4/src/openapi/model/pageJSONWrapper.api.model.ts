/**
 * GeoNetwork 4.0.3 OpenAPI Documentation
 * This is the description of the GeoNetwork OpenAPI. Use this API to manage your catalog.
 *
 * The version of the OpenAPI document: 4.0.3
 * Contact: geonetwork-users@lists.sourceforge.net
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

export interface PageJSONWrapperApiModel {
  format?: PageJSONWrapperApiModel.FormatEnum
  status?: PageJSONWrapperApiModel.StatusEnum
  link?: string
  sections?: Array<PageJSONWrapperApiModel.SectionsEnum>
  linkText?: string
  language?: string
}
export namespace PageJSONWrapperApiModel {
  export type FormatEnum = 'LINK' | 'HTML' | 'TEXT' | 'MARKDOWN' | 'WIKI'
  export const FormatEnum = {
    Link: 'LINK' as FormatEnum,
    Html: 'HTML' as FormatEnum,
    Text: 'TEXT' as FormatEnum,
    Markdown: 'MARKDOWN' as FormatEnum,
    Wiki: 'WIKI' as FormatEnum,
  }
  export type StatusEnum = 'PUBLIC' | 'PUBLIC_ONLY' | 'PRIVATE' | 'HIDDEN'
  export const StatusEnum = {
    Public: 'PUBLIC' as StatusEnum,
    PublicOnly: 'PUBLIC_ONLY' as StatusEnum,
    Private: 'PRIVATE' as StatusEnum,
    Hidden: 'HIDDEN' as StatusEnum,
  }
  export type SectionsEnum =
    | 'ALL'
    | 'TOP'
    | 'FOOTER'
    | 'MENU'
    | 'SUBMENU'
    | 'CUSTOM_MENU1'
    | 'CUSTOM_MENU2'
    | 'CUSTOM_MENU3'
    | 'DRAFT'
  export const SectionsEnum = {
    All: 'ALL' as SectionsEnum,
    Top: 'TOP' as SectionsEnum,
    Footer: 'FOOTER' as SectionsEnum,
    Menu: 'MENU' as SectionsEnum,
    Submenu: 'SUBMENU' as SectionsEnum,
    CustomMenu1: 'CUSTOM_MENU1' as SectionsEnum,
    CustomMenu2: 'CUSTOM_MENU2' as SectionsEnum,
    CustomMenu3: 'CUSTOM_MENU3' as SectionsEnum,
    Draft: 'DRAFT' as SectionsEnum,
  }
}