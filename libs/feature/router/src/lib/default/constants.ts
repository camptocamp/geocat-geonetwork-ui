export const ROUTER_STATE_KEY = 'router'

export const ROUTER_ROUTE_SEARCH = 'search'
export const ROUTER_ROUTE_DATASET = 'dataset'

export enum ROUTE_PARAMS {
  SORT = '_sort',
  PUBLISHER = 'publisher', // FIXME: this shouldn't be here as it is a search field
  PAGE = '_page',
  LOCATION = 'location',
  BBOX = 'bbox',
}
export type SearchRouteParams = Record<string, string | string[] | number>
