import type { FeatureCollection } from 'geojson'

export enum MapContextLayerTypeEnum {
  XYZ = 'xyz',
  WMS = 'wms',
  WFS = 'wfs',
  GEOJSON = 'geojson',
}

export interface MapContextModel {
  layers: MapContextLayerModel[]
  view?: MapContextViewModel
  extent?: MapContextExtentModel
}

export interface MapContextLayerModel {
  type: MapContextLayerTypeEnum
  url?: string
  name?: string
  data?: FeatureCollection
}

export interface MapContextViewModel {
  center: [number, number] //expressed in map projection (EPSG:3857)
  zoom: number
}
export type MapContextExtentModel = [number, number, number, number] //expressed in map projection (EPSG:3857)