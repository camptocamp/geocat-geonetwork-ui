/**
 * DataFeeder API
 * This API covers dataset upload and publishing features of the application
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: psc@georchestra.org
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

/**
 * User supplied dataset metadata information
 */
export interface DatasetMetadataApiModel {
  /**
   * Metadata title for the dataset
   */
  title: string
  /**
   * Metadata abtract text for the dataset
   */
  abstract: string
  /**
   * metadata keyworkds for the dataset
   */
  tags?: Array<string>
  /**
   * Dataset creation date, in RFC3339 format
   */
  creationDate?: string
  /**
   * Optional, scale the data was created for (e.g. 500000 for a 1:500000 scale)
   */
  scale?: number
  /**
   * textual description of dataset lineage
   */
  creationProcessDescription?: string
}
