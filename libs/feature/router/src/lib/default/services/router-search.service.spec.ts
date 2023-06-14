import { FieldsService, SearchFacade } from '@geonetwork-ui/feature/search'
import { SortByEnum } from '@geonetwork-ui/util/shared'
import { BehaviorSubject } from 'rxjs'
import { RouterFacade } from '../state'
import { RouterSearchService } from './router-search.service'
import { LocationBbox } from '../../../../../search/src/lib/location-search/location-search-result.model'
import { RouterService } from '@geonetwork-ui/feature/router'

let state = {}

class SearchFacadeMock {
  searchFilters$ = new BehaviorSubject(state)
  sortBy$ = new BehaviorSubject('_score')
}

class RouterFacadeMock {
  setSearch = jest.fn()
  updateSearch = jest.fn()
  go = jest.fn()
}

class FieldsServiceMock {
  mapping = {
    publisher: 'OrgForResource',
    q: 'any',
  }
  supportedFields = Object.keys(this.mapping)
  getValuesForFilters = jest.fn((fieldName, filters) => {
    const filter = filters[this.mapping[fieldName]]
    if (!filter) return []
    if (typeof filter === 'string') return [filter]
    return Object.keys(filter)
  })
}

class RouterServiceMock {
  getSearchRoute = jest.fn().mockReturnValue('/test/path')
}

describe('RouterSearchService', () => {
  let service: RouterSearchService
  let routerFacade: RouterFacade
  let searchFacade: SearchFacade
  let fieldsService: FieldsService
  let routerService: RouterService

  beforeEach(() => {
    state = { OrgForResource: { mel: true } }
    routerFacade = new RouterFacadeMock() as any
    searchFacade = new SearchFacadeMock() as any
    fieldsService = new FieldsServiceMock() as any
    routerService = new RouterServiceMock() as any
    service = new RouterSearchService(
      searchFacade,
      routerFacade,
      fieldsService,
      routerService
    )
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
  describe('#setSearch', () => {
    it('dispatch setSearch with mapped params', async () => {
      const state = {
        any: 'any',
        OrgForResource: {
          Org: true,
        },
      }
      service.setFilters(state)
      await Promise.resolve() // lets promises run
      expect(routerFacade.setSearch).toHaveBeenCalledWith({
        q: ['any'],
        publisher: ['Org'],
        _sort: '_score',
      })
    })
  })

  describe('#setSortAndFilters', () => {
    it('dispatch setSearch with mapped params', () => {
      const filters = {
        any: 'any',
        OrgForResource: {
          Org: true,
        },
      }
      const sort = SortByEnum.CREATE_DATE
      service.setSortAndFilters(filters, sort)
      expect(routerFacade.setSearch).toHaveBeenCalledWith({
        q: ['any'],
        publisher: ['Org'],
        _sort: '-createDate',
      })
    })
  })

  describe('#setSortBy', () => {
    it('dispatch sortBy', () => {
      service.setSortBy(SortByEnum.RELEVANCY)
      expect(routerFacade.updateSearch).toHaveBeenCalledWith({
        _sort: SortByEnum.RELEVANCY,
      })
    })
  })

  describe('#updateSearch', () => {
    beforeEach(() => {
      const state = {
        any: 'any',
      }
      service.updateFilters(state)
    })
    it('dispatch updateSearch with merged mapped params', () => {
      expect(routerFacade.updateSearch).toHaveBeenCalledWith({
        q: ['any'],
        publisher: ['mel'],
      })
    })
  })

  describe('#setLocationFilter', () => {
    beforeEach(() => {
      const location: LocationBbox = {
        label: 'New location',
        bbox: [4, 5, 6, 7],
      }
      service.setLocationFilter(location)
    })
    it('dispatch setLocationFilter with merged mapped params', () => {
      expect(routerFacade.go).toHaveBeenCalledWith({
        path: '/test/path',
        query: {
          location: 'New location',
          bbox: '4,5,6,7',
        },
        queryParamsHandling: 'merge',
      })
    })
  })

  describe('#clearLocationFilter', () => {
    beforeEach(() => {
      service.clearLocationFilter()
    })
    it('dispatch clearLocationFilter with merged mapped params', () => {
      expect(routerFacade.go).toHaveBeenCalledWith({
        path: '/test/path',
        query: {
          location: undefined,
          bbox: undefined,
        },
        queryParamsHandling: 'merge',
      })
    })
  })
})
