import {
  FieldsService,
  LocationBbox,
  SearchFacade,
} from '@geonetwork-ui/feature/search'
import { SortByEnum, SortByField } from '@geonetwork-ui/common/domain/search'
import { BehaviorSubject, of } from 'rxjs'
import { RouterFacade } from '../state'
import { RouterSearchService } from './router-search.service'
import { RouterService } from '../router.service'

let state = {}
class SearchFacadeMock {
  searchFilters$ = new BehaviorSubject(state)
  sortBy$: BehaviorSubject<SortByField> = new BehaviorSubject(['asc', '_score'])
}

class RouterFacadeMock {
  setSearch = jest.fn()
  updateSearch = jest.fn()
  go = jest.fn()
}

class FieldsServiceMock {
  mapping = {
    OrgForResource: 'publisher',
    any: 'q',
  }
  readFieldValuesFromFilters = jest.fn((filters) =>
    of(
      Object.keys(filters).reduce((prev, curr) => {
        const fieldName = this.mapping[curr]
        const filter = filters[curr]
        let values = []
        if (typeof filter === 'string') {
          values = [filter]
        } else if (filter) {
          values = Object.keys(filter)
        }
        return {
          ...prev,
          [fieldName]: values,
        }
      }, {})
    )
  )
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
      await service.setFilters(state)
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
        _sort: '-_score',
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
