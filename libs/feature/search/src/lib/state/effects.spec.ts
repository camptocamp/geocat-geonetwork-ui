import { TestBed } from '@angular/core/testing'
import {
  AddResults,
  ClearError,
  ClearLocationFilter,
  ClearResults,
  DEFAULT_SEARCH_KEY,
  Paginate,
  PatchResultsAggregations,
  RequestMoreOnAggregation,
  RequestMoreResults,
  RequestNewResults,
  SetError,
  SetFavoritesOnly,
  SetFilters,
  SetIncludeOnAggregation,
  SetLocationFilter,
  SetPageSize,
  SetResultsAggregations,
  SetResultsHits,
  SetSearch,
  SetSortBy,
  SetSpatialFilterEnabled,
  UpdateFilters,
} from './actions'
import { EffectsModule } from '@ngrx/effects'
import { provideMockActions } from '@ngrx/effects/testing'
import { Store, StoreModule } from '@ngrx/store'
import { getTestScheduler, hot } from 'jasmine-marbles'
import { firstValueFrom, Observable, of, throwError } from 'rxjs'
import { SearchEffects } from './effects'
import {
  initialState,
  reducer,
  SEARCH_FEATURE_KEY,
  SearchState,
} from './reducer'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import {
  DATASET_RECORDS,
  SAMPLE_AGGREGATIONS_PARAMS,
  SAMPLE_AGGREGATIONS_RESULTS,
  SAMPLE_SEARCH_RESULTS,
} from '@geonetwork-ui/common/fixtures'
import { HttpErrorResponse } from '@angular/common/http'
import { delay } from 'rxjs/operators'
import { FILTER_GEOMETRY } from '../feature-search.module'
import { RecordsRepositoryInterface } from '@geonetwork-ui/common/domain/records-repository.interface'
import { TestScheduler } from 'rxjs/internal/testing/TestScheduler'
import {
  AuthService,
  FavoritesService,
} from '@geonetwork-ui/api/repository/gn4'

const defaultSearchState = initialState[DEFAULT_SEARCH_KEY]
const stateWithSearches = {
  ...initialState,
  [DEFAULT_SEARCH_KEY]: {
    ...defaultSearchState,
    config: {
      ...defaultSearchState.config,
      aggregations: SAMPLE_AGGREGATIONS_PARAMS,
    },
  },
  main: {
    ...defaultSearchState,
    config: {
      ...defaultSearchState.config,
      aggregations: {},
    },
  },
}

class AuthServiceMock {
  authReady = () => of(true)
}
class FavoritesServiceMock {
  myFavoritesUuid$ = of(['fav001', 'fav002', 'fav003'])
}

class RecordsRepositoryMock {
  aggregate = jest.fn(() => of(SAMPLE_AGGREGATIONS_RESULTS))
  search = jest.fn(() => of(SAMPLE_SEARCH_RESULTS))
}

describe('Effects', () => {
  let effects: SearchEffects
  let actions$: Observable<any>
  let repository: RecordsRepositoryInterface

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        EffectsModule.forRoot(),
        StoreModule.forRoot({}),
        StoreModule.forFeature(SEARCH_FEATURE_KEY, reducer, {
          initialState: stateWithSearches,
        }),
        HttpClientTestingModule,
      ],
      providers: [
        provideMockActions(() => actions$),
        SearchEffects,
        {
          provide: AuthService,
          useClass: AuthServiceMock,
        },
        {
          provide: FavoritesService,
          useClass: FavoritesServiceMock,
        },
        {
          provide: RecordsRepositoryInterface,
          useClass: RecordsRepositoryMock,
        },
        {
          provide: FILTER_GEOMETRY,
          useValue: null,
        },
      ],
    })
    effects = TestBed.inject(SearchEffects)
    repository = TestBed.inject(RecordsRepositoryInterface)
  })

  it('should be created', () => {
    expect(effects).toBeTruthy()
  })

  describe('resetPagination$', () => {
    it('resets pagination on filters change', () => {
      actions$ = hot('-a-', { a: new SetFilters({ any: 'abcd', other: 'ef' }) })
      const expected = hot('-b-', {
        b: new Paginate(1),
      })
      expect(effects.resetPagination$).toBeObservable(expected)
    })
    it('resets pagination on filters update', () => {
      actions$ = hot('-a-', { a: new UpdateFilters({ any: 'abcd' }) })
      const expected = hot('-b-', {
        b: new Paginate(1),
      })
      expect(effects.resetPagination$).toBeObservable(expected)
    })
    it('resets pagination on filters update', () => {
      actions$ = hot('-a-', {
        a: new SetSearch({ filters: { any: 'abcd' } } as any, 'main'),
      })
      const expected = hot('-b-', {
        b: new Paginate(1, 'main'),
      })
      expect(effects.resetPagination$).toBeObservable(expected)
    })
  })

  describe('requestNewResults$', () => {
    let testScheduler: TestScheduler
    beforeEach(() => {
      testScheduler = new TestScheduler((actual, expected) => {
        expect(actual).toEqual(expected)
      })
    })

    it('request new results on sortBy action', () => {
      testScheduler.run(({ hot, expectObservable }) => {
        actions$ = hot('-a---', {
          a: new SetSortBy(['asc', 'fieldA']),
        })
        const expected = hot('-b', {
          b: new RequestNewResults(),
        })

        expectObservable(effects.requestNewResults$).toEqual(expected)
      })
    })
    it('request new results on setFilters action', () => {
      testScheduler.run(({ hot, expectObservable }) => {
        actions$ = hot('-a---', {
          a: new SetFilters({ any: 'abcd', other: 'ef' }),
        })
        const expected = hot('-b', {
          b: new RequestNewResults(),
        })

        expectObservable(effects.requestNewResults$).toEqual(expected)
      })
    })
    it('request new results on updateFilters action', () => {
      testScheduler.run(({ hot, expectObservable }) => {
        actions$ = hot('-a---', {
          a: new UpdateFilters({ any: 'abcd' }),
        })
        const expected = hot('-b', {
          b: new RequestNewResults(),
        })

        expectObservable(effects.requestNewResults$).toEqual(expected)
      })
    })
    it('request new results on setSearch action', () => {
      testScheduler.run(({ hot, expectObservable }) => {
        actions$ = hot('-a---', {
          a: new SetSearch({ filters: { any: 'abcd' } } as any, 'main'),
        })
        const expected = hot('-b', {
          b: new RequestNewResults('main'),
        })
        expectObservable(effects.requestNewResults$).toEqual(expected)
      })
    })
    it('request new results on setSpatialFilterEnabled action', () => {
      testScheduler.run(({ hot, expectObservable }) => {
        actions$ = hot('-a---', {
          a: new SetSpatialFilterEnabled(true, 'main'),
        })
        const expected = hot('-b', {
          b: new RequestNewResults('main'),
        })

        expectObservable(effects.requestNewResults$).toEqual(expected)
      })
    })

    it('request new results on SetPagination action', () => {
      testScheduler.run(({ hot, expectObservable }) => {
        actions$ = hot('-a---', {
          a: new SetPageSize(15, 'main'),
        })
        const expected = hot('-b', {
          b: new RequestNewResults('main'),
        })

        expectObservable(effects.requestNewResults$).toEqual(expected)
      })
    })

    it('request new results on Paginate action', () => {
      testScheduler.run(({ hot, expectObservable }) => {
        actions$ = hot('-a---', {
          a: new Paginate(4),
        })
        const expected = hot('-b', {
          b: new RequestNewResults(),
        })

        expectObservable(effects.requestNewResults$).toEqual(expected)
      })
    })

    it('request new results on setLocationFilter action', () => {
      testScheduler.run(({ hot, expectObservable }) => {
        actions$ = hot('-a---', {
          a: new SetLocationFilter('myLoc', [1, 2, 3, 4], 'main'),
        })
        const expected = hot('-b---', {
          b: new RequestNewResults('main'),
        })

        expectObservable(effects.requestNewResults$).toEqual(expected)
      })
    })

    it('request new results on clearLocationFilter action', () => {
      testScheduler.run(({ hot, expectObservable }) => {
        actions$ = hot('-a---', {
          a: new ClearLocationFilter('main'),
        })
        const expected = hot('-b---', {
          b: new RequestNewResults('main'),
        })

        expectObservable(effects.requestNewResults$).toEqual(expected)
      })
    })

    describe('several param changes in the same frame', () => {
      it('only issues one new RequestNewResults action (same search id)', () => {
        testScheduler.run(({ hot, expectObservable }) => {
          actions$ = hot('-(abcde)-', {
            a: new SetSpatialFilterEnabled(true, 'main'),
            b: new SetSortBy(['asc', 'fieldA'], 'main'),
            c: new SetFilters({ any: 'abcd', other: 'ef' }, 'main'),
            d: new Paginate(4, 'main'),
            e: new SetLocationFilter('myLoc', [1, 2, 3, 4], 'main'),
          })
          const expected = hot('-b', {
            b: new RequestNewResults('main'),
          })

          expectObservable(effects.requestNewResults$).toEqual(expected)
        })
      })
      it('issues one new RequestNewResults action per search id', () => {
        testScheduler.run(({ hot, expectObservable }) => {
          actions$ = hot('-(abcd)-', {
            a: new SetSpatialFilterEnabled(true, 'main'),
            b: new SetSortBy(['asc', 'fieldA'], 'main'),
            c: new SetFilters({ any: 'abcd', other: 'ef' }, 'other'),
            d: new Paginate(4, 'other'),
          })
          const expected = hot('-(bc)', {
            b: new RequestNewResults('main'),
            c: new RequestNewResults('other'),
          })

          expectObservable(effects.requestNewResults$).toEqual(expected)
        })
      })
    })
  })
  describe('loadResults$', () => {
    it('load new results on requestMoreResults action', () => {
      actions$ = hot('-a-', { a: new RequestMoreResults() })
      const expected = hot('-(ebcd)-', {
        b: new AddResults(DATASET_RECORDS),
        c: new SetResultsAggregations(SAMPLE_AGGREGATIONS_RESULTS),
        d: new SetResultsHits(123),
        e: new ClearError(),
      })
      expect(effects.loadResults$).toBeObservable(expected)
    })

    it('load new results and clear previous ones on requestNewResults action', () => {
      actions$ = hot('-a-', { a: new RequestNewResults() })
      const expected = hot('-(febcd)-', {
        b: new AddResults(DATASET_RECORDS),
        c: new SetResultsAggregations(SAMPLE_AGGREGATIONS_RESULTS),
        d: new SetResultsHits(123),
        e: new ClearError(),
        f: new ClearResults(),
      })
      expect(effects.loadResults$).toBeObservable(expected)
    })

    it('propagate action search id', () => {
      actions$ = hot('-a-', { a: new RequestNewResults('main') })
      const expected = hot('-(febcd)-', {
        b: new AddResults(DATASET_RECORDS, 'main'),
        c: new SetResultsAggregations(SAMPLE_AGGREGATIONS_RESULTS, 'main'),
        d: new SetResultsHits(123, 'main'),
        e: new ClearError('main'),
        f: new ClearResults('main'),
      })
      expect(effects.loadResults$).toBeObservable(expected)
    })

    describe('when running multiple searches concurrently', () => {
      beforeEach(() => {
        repository.search = () =>
          of(SAMPLE_SEARCH_RESULTS).pipe(delay(10, getTestScheduler()))
      })
      it('cancels requests with the same search id', () => {
        actions$ = hot('-(aabab)-', {
          a: new RequestMoreResults('main'),
          b: new RequestMoreResults(DEFAULT_SEARCH_KEY),
        })
        const expected = hot('--(dabczwxy)-', {
          a: new AddResults(SAMPLE_SEARCH_RESULTS.records, 'main'),
          b: new SetResultsAggregations(SAMPLE_AGGREGATIONS_RESULTS, 'main'),
          c: new SetResultsHits(123, 'main'),
          d: new ClearError('main'),
          w: new AddResults(SAMPLE_SEARCH_RESULTS.records, DEFAULT_SEARCH_KEY),
          x: new SetResultsAggregations(
            SAMPLE_AGGREGATIONS_RESULTS,
            DEFAULT_SEARCH_KEY
          ),
          y: new SetResultsHits(123, DEFAULT_SEARCH_KEY),
          z: new ClearError(DEFAULT_SEARCH_KEY),
        })
        expect(effects.loadResults$).toBeObservable(expected)
      })
    })

    describe('when search fails with HTTP error', () => {
      beforeEach(() => {
        repository.search = () =>
          throwError(
            () =>
              new HttpErrorResponse({
                status: 401,
              })
          )
      })
      it('stores the error', () => {
        actions$ = hot('-a-', { a: new RequestMoreResults() })
        const expected = hot('-b-', {
          b: new SetError(401, expect.stringContaining('401')),
        })
        expect(effects.loadResults$).toBeObservable(expected)
      })
      it('stores the error and propagates search id', () => {
        actions$ = hot('-a-', { a: new RequestMoreResults('main') })
        const expected = hot('-b-', {
          b: new SetError(401, expect.stringContaining('401'), 'main'),
        })
        expect(effects.loadResults$).toBeObservable(expected)
      })
    })

    describe('when search fails with unspecified error', () => {
      beforeEach(() => {
        const repository = TestBed.inject(RecordsRepositoryInterface)
        repository.search = () =>
          throwError(() => new Error('probably CORS related'))
      })
      it('stores the error with a 0 code and propagates search id', () => {
        actions$ = hot('-a-', { a: new RequestMoreResults('main') })
        const expected = hot('-b-', {
          b: new SetError(0, 'probably CORS related', 'main'),
        })
        expect(effects.loadResults$).toBeObservable(expected)
      })
    })

    it('does not filter by favorites by default', async () => {
      actions$ = of(new RequestMoreResults('main'))
      await firstValueFrom(effects.loadResults$)
      expect(repository.search).toHaveBeenCalledWith(
        expect.objectContaining({
          filterIds: undefined,
        })
      )
    })

    describe('when asking for favorites only', () => {
      let store: Store<SearchState>
      beforeEach(() => {
        store = TestBed.inject(Store)
        store.dispatch(new SetFavoritesOnly(true, 'main'))
      })
      it('requests results', () => {
        actions$ = hot('-a-', {
          a: new RequestMoreResults('main'),
        })
        const expected = hot('-(abcd)-', {
          a: new ClearError('main'),
          b: new AddResults(DATASET_RECORDS, 'main'),
          c: new SetResultsAggregations(SAMPLE_AGGREGATIONS_RESULTS, 'main'),
          d: new SetResultsHits(123, 'main'),
        })
        expect(effects.loadResults$).toBeObservable(expected)
      })
      it('filter results within a certain set of ids', async () => {
        actions$ = of(new RequestMoreResults('main'))
        await firstValueFrom(effects.loadResults$)
        expect(repository.search).toHaveBeenCalledWith(
          expect.objectContaining({
            filterIds: ['fav001', 'fav002', 'fav003'],
          })
        )
      })
    })

    describe('when providing a filter geometry', () => {
      beforeEach(() => {
        effects['filterGeometry$'] = of({
          type: 'Polygon',
          coordinates: [],
        })
        effects = TestBed.inject(SearchEffects)
      })
      describe('when useSpatialFilter is enabled', () => {
        beforeEach(() => {
          TestBed.inject(Store).dispatch(
            new SetSpatialFilterEnabled(true, 'main')
          )
        })
        it('passes the geometry to the repository', async () => {
          actions$ = of(new RequestMoreResults('main'))
          await firstValueFrom(effects.loadResults$)
          expect(repository.search).toHaveBeenCalledWith(
            expect.objectContaining({
              filterGeometry: { type: 'Polygon', coordinates: [] },
            })
          )
        })
      })
      describe('when useSpatialFilter is disabled', () => {
        beforeEach(() => {
          TestBed.inject(Store).dispatch(
            new SetSpatialFilterEnabled(false, 'main')
          )
        })
        it('does not pass the geometry to the repository', async () => {
          actions$ = of(new RequestMoreResults('main'))
          await firstValueFrom(effects.loadResults$)
          expect(repository.search).toHaveBeenCalledWith(
            expect.objectContaining({ filterGeometry: undefined })
          )
        })
      })

      describe('when the geometry promise fails', () => {
        beforeEach(() => {
          effects['filterGeometry$'] = throwError(() => 'blarg')
          TestBed.inject(Store).dispatch(
            new SetSpatialFilterEnabled(true, 'main')
          )
        })
        it('does not pass the geometry to the repository', async () => {
          actions$ = of(new RequestMoreResults('main'))
          await firstValueFrom(effects.loadResults$)
          expect(repository.search).toHaveBeenCalledWith(
            expect.objectContaining({
              filterGeometry: undefined,
            })
          )
        })
      })
    })

    // FIXME: REACTIVATE
    describe.skip('when a location filter is present in the state', () => {
      beforeEach(() => {
        TestBed.inject(Store).dispatch(
          new SetLocationFilter('myLoc', [1, 2, 3, 4], 'main')
        )
      })
      it('passes the bbox as geometry to the ES service', async () => {
        actions$ = of(new RequestMoreResults('main'))
        await firstValueFrom(effects.loadResults$)
        expect(repository.search).toHaveBeenCalledWith(
          expect.objectContaining({
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [1, 2],
                  [1, 4],
                  [3, 4],
                  [3, 2],
                  [1, 2],
                ],
              ],
            },
          })
        )
      })
    })
  })

  describe('updateRequestAggregation$', () => {
    describe('RequestMoreOnAggregation action', () => {
      it('dispatch PATCH_RESULTS_AGGREGATIONS', () => {
        actions$ = hot('-a-', { a: new RequestMoreOnAggregation('myField', 1) })
        const expected = hot('-b-', {
          b: new PatchResultsAggregations(
            'myField',
            SAMPLE_AGGREGATIONS_RESULTS['myField']
          ),
        })

        expect(effects.updateRequestAggregation$).toBeObservable(expected)
      })
    })
    describe('SetIncludeOnAggregation action', () => {
      it('dispatch UPDATE_REQUEST_AGGREGATION_TERM', () => {
        actions$ = hot('-a-', {
          a: new SetIncludeOnAggregation('myField', '*land*'),
        })
        const expected = hot('-b-', {
          b: new PatchResultsAggregations(
            'myField',
            SAMPLE_AGGREGATIONS_RESULTS['myField']
          ),
        })

        expect(effects.updateRequestAggregation$).toBeObservable(expected)
      })
    })
  })
})
