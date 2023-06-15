import { Location } from '@angular/common'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { Params, Router } from '@angular/router'
import { MdViewActions } from '@geonetwork-ui/feature/record'
import {
  ClearLocationFilter,
  SetFilters,
  SetLocationFilter,
  SetSortBy,
} from '@geonetwork-ui/feature/search'
import { provideMockActions } from '@ngrx/effects/testing'
import { routerNavigationAction } from '@ngrx/router-store'
import { Action } from '@ngrx/store'
import { hot } from 'jasmine-marbles'
import { BehaviorSubject, Observable } from 'rxjs'
import { ROUTER_CONFIG } from '../router.module'

import * as fromActions from './router.actions'
import { RouterGoActionPayload } from './router.actions'
import * as fromEffects from './router.effects'
import { RouterFacade } from './router.facade'
import { TranslateModule } from '@ngx-translate/core'

class SearchRouteComponent extends Component {}

class MetadataRouteComponent extends Component {}

const routerConfigMock = {
  searchStateId: 'main',
  searchRouteComponent: SearchRouteComponent,
  recordRouteComponent: MetadataRouteComponent,
}

const routerFacadeMock = {
  searchParams$: new BehaviorSubject<Params>({
    q: 'any',
    _sort: '-createDate',
    location: 'Zurich',
    bbox: '1,2,3,4',
  }),
}

describe('RouterEffects', () => {
  let router: Router
  let location: Location
  let effects: fromEffects.RouterEffects
  let actions: Observable<Action>

  const RouterMock = {
    navigate: jest.fn(),
  }
  const LocationMock = {
    back: jest.fn(),
    forward: jest.fn(),
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      providers: [
        fromEffects.RouterEffects,
        provideMockActions(() => actions),
        {
          provide: Router,
          useValue: RouterMock,
        },
        {
          provide: Location,
          useValue: LocationMock,
        },
        {
          provide: ROUTER_CONFIG,
          useValue: routerConfigMock,
        },
        {
          provide: RouterFacade,
          useValue: routerFacadeMock,
        },
      ],
    })

    effects = TestBed.inject(fromEffects.RouterEffects)
    router = TestBed.inject(Router)
    location = TestBed.inject(Location)
  })

  describe('navigateToMetadata$', () => {
    it('should dispatch a loadFullMetadata action', () => {
      actions = hot('-a', {
        a: routerNavigationAction({
          payload: {
            routerState: {
              root: {
                routeConfig: {
                  component: MetadataRouteComponent,
                },
                params: {
                  metadataUuid: 'abcdef',
                },
              },
            },
          },
        } as any),
      })
      const expected = hot('-(ba)', {
        a: MdViewActions.loadFullMetadata({ uuid: 'abcdef' }),
        b: MdViewActions.setIncompleteMetadata({
          incomplete: {
            uuid: 'abcdef',
            id: '',
            title: '',
            metadataUrl: '',
          },
        }),
      })
      expect(effects.navigateToMetadata$).toBeObservable(expected)
    })
  })

  describe('navigateToSearch$', () => {
    it('should dispatch a loadFullMetadata action', () => {
      actions = hot('-a', {
        a: routerNavigationAction({
          payload: {
            routerState: {
              root: {
                routeConfig: {
                  component: SearchRouteComponent,
                },
                params: {},
              },
            },
          },
        } as any),
      })
      const expected = hot('-a', {
        a: MdViewActions.close(),
      })
      expect(effects.navigateToSearch$).toBeObservable(expected)
    })
  })

  describe('navigate$', () => {
    it('should call router navigate', () => {
      const payload: RouterGoActionPayload = {
        path: '.',
        query: {
          id: 10,
        },
      }
      actions = hot('--a', { a: fromActions.goAction(payload) })

      effects.navigate$.subscribe(() => {
        const { path, query: queryParams } = payload
        expect(router.navigate).toHaveBeenCalledWith(path, {
          queryParams,
        })
      })
    })
  })

  describe('navigateBack$', () => {
    it('should call location back', () => {
      actions = hot('-a', { a: fromActions.backAction() })

      effects.navigate$.subscribe(() => {
        expect(location.back).toHaveBeenCalled()
      })
    })
  })

  describe('navigateForward$', () => {
    it('should call location forward', () => {
      actions = hot('-a', { a: fromActions.forwardAction() })

      effects.navigate$.subscribe(() => {
        expect(location.forward).toHaveBeenCalled()
      })
    })
  })

  describe('syncSearchState$', () => {
    describe('when a sort value and location in the route', () => {
      beforeEach(() => {
        actions = hot('-a', { a: routerFacadeMock.searchParams$ })
      })
      it('dispatches SetFilters and SortBy actions', () => {
        const expected = hot('(abc)', {
          a: new SetFilters({ any: 'any' }, 'main'),
          b: new SetSortBy('-createDate', 'main'),
          c: new SetLocationFilter('Zurich', [1, 2, 3, 4], 'main'),
        })
        expect(effects.syncSearchState$).toBeObservable(expected)
      })
    })
    describe('when no sort value and no location in the route', () => {
      beforeEach(() => {
        routerFacadeMock.searchParams$.next({ q: 'any', location: undefined })
        actions = hot('-a', { a: routerFacadeMock.searchParams$ })
      })
      it('dispatches SetFilters and SortBy actions with default sort value', () => {
        const expected = hot('(abc)', {
          a: new SetFilters({ any: 'any' }, 'main'),
          b: new SetSortBy('_score', 'main'),
          c: new ClearLocationFilter('main'),
        })
        expect(effects.syncSearchState$).toBeObservable(expected)
      })
    })
  })
})
