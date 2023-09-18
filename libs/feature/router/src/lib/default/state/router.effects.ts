import { Location } from '@angular/common'
import { Inject, Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, Router } from '@angular/router'
import { MdViewActions } from '@geonetwork-ui/feature/record'
import {
  ClearLocationFilter,
  FieldsService,
  Paginate,
  SearchActions,
  SetFilters,
  SetLocationFilter,
  SetSortBy,
} from '@geonetwork-ui/feature/search'
import { FieldFilters, SortByEnum } from '@geonetwork-ui/common/domain/search'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { navigation } from '@ngrx/router-store/data-persistence'
import { of, pairwise, startWith, withLatestFrom } from 'rxjs'
import { map, mergeMap, tap } from 'rxjs/operators'
import * as RouterActions from './router.actions'
import { RouterFacade } from './router.facade'
import { ROUTE_PARAMS } from '../constants'
import { sortByFromString } from '@geonetwork-ui/util/shared'
import { ROUTER_CONFIG, RouterConfigModel } from '../router.config'

@Injectable()
export class RouterEffects {
  constructor(
    private _actions$: Actions,
    private _router: Router,
    private _location: Location,
    private facade: RouterFacade,
    @Inject(ROUTER_CONFIG) private routerConfig: RouterConfigModel,
    private fieldsService: FieldsService
  ) {}

  navigate$ = createEffect(
    () =>
      this._actions$.pipe(
        ofType(RouterActions.goAction),
        tap(({ path, query: queryParams, queryParamsHandling }) => {
          this._router.navigate([path], {
            queryParams,
            queryParamsHandling,
          })
        })
      ),
    { dispatch: false }
  )

  syncSearchState$ = createEffect(() =>
    this.facade.searchParams$.pipe(
      mergeMap((searchParams: Record<string, string>) =>
        this.fieldsService
          .buildFiltersFromFieldValues(searchParams)
          .pipe(map((filters) => [searchParams, filters] as const))
      ),
      startWith([null, {}] as [Record<string, string>, FieldFilters]),
      pairwise(),
      map(([[oldParams, oldFilters], [newParams, newFilters]]) => {
        let sortBy =
          ROUTE_PARAMS.SORT in newParams
            ? sortByFromString(newParams[ROUTE_PARAMS.SORT])
            : SortByEnum.RELEVANCY
        let pageNumber =
          ROUTE_PARAMS.PAGE in newParams
            ? parseInt(newParams[ROUTE_PARAMS.PAGE])
            : 1
        let location =
          ROUTE_PARAMS.LOCATION in newParams
            ? newParams[ROUTE_PARAMS.LOCATION]
            : ''
        let bbox =
          ROUTE_PARAMS.BBOX in newParams ? newParams[ROUTE_PARAMS.BBOX] : ''
        if (oldParams !== null) {
          const oldSort =
            ROUTE_PARAMS.SORT in oldParams
              ? sortByFromString(oldParams[ROUTE_PARAMS.SORT])
              : SortByEnum.RELEVANCY
          if (JSON.stringify(sortBy) === JSON.stringify(oldSort)) {
            sortBy = null
          }
          const oldPage =
            ROUTE_PARAMS.PAGE in oldParams
              ? parseInt(oldParams[ROUTE_PARAMS.PAGE])
              : 1
          if (pageNumber === oldPage) {
            pageNumber = null
          }
          const oldLocation =
            ROUTE_PARAMS.LOCATION in oldParams
              ? oldParams[ROUTE_PARAMS.LOCATION]
              : ''
          const oldBbox =
            ROUTE_PARAMS.BBOX in oldParams ? oldParams[ROUTE_PARAMS.BBOX] : ''
          if (location === oldLocation && bbox === oldBbox) {
            location = null
            bbox = null
          }
        }
        const filters =
          JSON.stringify(oldFilters) === JSON.stringify(newFilters)
            ? null
            : newFilters
        return [sortBy, pageNumber, filters, location, bbox] as const
      }),
      mergeMap(([sortBy, pageNumber, filters, location, bbox]) => {
        const locationFilterAction = () => {
          if (location !== '' && bbox !== '') {
            return new SetLocationFilter(
              location,
              bbox.split(',').map(Number) as [number, number, number, number],
              this.routerConfig.searchStateId
            )
          } else {
            return new ClearLocationFilter(this.routerConfig.searchStateId)
          }
        }

        const actions: SearchActions[] = []
        if (filters !== null) {
          actions.push(new SetFilters(filters, this.routerConfig.searchStateId))
        }
        if (sortBy !== null) {
          actions.push(new SetSortBy(sortBy, this.routerConfig.searchStateId))
        }
        if (pageNumber !== null) {
          actions.push(
            new Paginate(pageNumber, this.routerConfig.searchStateId)
          )
        }
        if (location !== null) {
          actions.push(locationFilterAction())
        }
        return of(...actions)
      })
    )
  )

  /**
   * This effect will load the metadata when a navigation to
   * a metadata record happens
   */
  navigateToMetadata$ = createEffect(() =>
    this._actions$.pipe(
      navigation(this.routerConfig.recordRouteComponent, {
        run: (activatedRouteSnapshot: ActivatedRouteSnapshot) => {
          return of(
            MdViewActions.setIncompleteMetadata({
              incomplete: {
                uniqueIdentifier: activatedRouteSnapshot.params.metadataUuid,
                title: '',
              },
            }),
            MdViewActions.loadFullMetadata({
              uuid: activatedRouteSnapshot.params.metadataUuid,
            })
          )
        },

        onError(a: ActivatedRouteSnapshot, e) {
          console.error('Navigation failed', e)
        },
      })
    )
  )

  /**
   * This effect will close the metadata when a navigation to
   * the search results happens
   */
  navigateToSearch$ = createEffect(() =>
    this._actions$.pipe(
      navigation(this.routerConfig.searchRouteComponent, {
        run: () => MdViewActions.close(),
      })
    )
  )

  navigateBack$ = createEffect(
    () =>
      this._actions$.pipe(
        ofType(RouterActions.backAction),
        tap(() => this._location.back())
      ),
    { dispatch: false }
  )

  navigateForward$ = createEffect(
    () =>
      this._actions$.pipe(
        ofType(RouterActions.forwardAction),
        tap(() => this._location.forward())
      ),
    { dispatch: false }
  )
}
