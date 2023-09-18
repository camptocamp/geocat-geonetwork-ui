import { Injectable } from '@angular/core'
import { SearchFacade } from '../../state/search.facade'
import {
  FieldFilters,
  SortByField,
} from '@geonetwork-ui/common/domain/model/search'
import { first, map } from 'rxjs/operators'
import { LocationBbox } from '../../location-search/location-search-result.model'

export interface SearchServiceI {
  updateFilters: (params: FieldFilters) => void
  setFilters: (params: FieldFilters) => void
  setSortAndFilters: (filters: FieldFilters, sort: SortByField) => void
  setSortBy: (sort: SortByField) => void
  setPage: (page: number) => void
  setLocationFilter: (location: LocationBbox) => void
  clearLocationFilter: () => void
}

@Injectable()
export class SearchService implements SearchServiceI {
  constructor(private facade: SearchFacade) {}

  setSortAndFilters(filters: FieldFilters, sort: SortByField) {
    this.setFilters(filters)
    this.setSortBy(sort)
  }

  updateFilters(params: FieldFilters) {
    this.facade.searchFilters$
      .pipe(
        first(),
        map((filters) => ({ ...filters, ...params }))
      )
      .subscribe((filters) => this.facade.setFilters(filters))
  }

  setFilters(params: FieldFilters) {
    this.facade.setFilters(params)
  }

  setSortBy(sort: SortByField): void {
    this.facade.setSortBy(sort)
  }

  setLocationFilter(location: LocationBbox) {
    this.facade.setLocationFilter(location.label, location.bbox)
  }

  clearLocationFilter() {
    this.facade.clearLocationFilter()
  }

  setPage(page: number): void {
    this.facade.paginate(page)
  }

  resetSearch(): void {
    this.facade.resetSearch()
  }
}
