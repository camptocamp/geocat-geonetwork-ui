import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewChild,
} from '@angular/core'
import { marker } from '@biesbjerg/ngx-translate-extract-marker'
import { AuthService } from '@geonetwork-ui/feature/auth'
import {
  ROUTER_ROUTE_SEARCH,
  RouterFacade,
} from '@geonetwork-ui/feature/router'
import {
  FieldsService,
  FuzzySearchComponent,
  LocationSearchComponent,
  SearchFacade,
  SearchService,
} from '@geonetwork-ui/feature/search'
import {
  getOptionalSearchConfig,
  getThemeConfig,
  SearchConfig,
  SearchPreset,
} from '@geonetwork-ui/util/app-config'
import { MetadataRecord, SortByEnum } from '@geonetwork-ui/util/shared'
import { map } from 'rxjs/operators'
import { ROUTER_ROUTE_NEWS } from '../../router/constants'
import { lastValueFrom } from 'rxjs'

marker('datahub.header.myfavorites')
marker('datahub.header.lastRecords')
marker('datahub.header.popularRecords')

@Component({
  selector: 'datahub-home-header',
  templateUrl: './home-header.component.html',
  styleUrls: ['./home-header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeHeaderComponent {
  @Input() expandRatio: number

  // specific geocat: used to trigger the other field when one is triggered
  @ViewChild(FuzzySearchComponent)
  textSearch: FuzzySearchComponent
  @ViewChild(LocationSearchComponent) locationSearch: LocationSearchComponent

  backgroundCss =
    getThemeConfig().HEADER_BACKGROUND ||
    `center /cover url('assets/img/header_bg.webp')`

  ROUTE_SEARCH = `${ROUTER_ROUTE_SEARCH}`
  SORT_BY_PARAMS = SortByEnum
  searchConfig: SearchConfig = getOptionalSearchConfig()

  constructor(
    public routerFacade: RouterFacade,
    public searchFacade: SearchFacade,
    private searchService: SearchService,
    private authService: AuthService,
    private fieldsService: FieldsService
  ) {}

  displaySortBadges$ = this.routerFacade.currentRoute$.pipe(
    map(
      (route) =>
        route.url[0].path === ROUTER_ROUTE_NEWS ||
        route.url[0].path === ROUTER_ROUTE_SEARCH
    )
  )

  isAuthenticated$ = this.authService
    .authReady()
    .pipe(map((user) => !!user?.id))

  onFuzzySearchSelection(record: MetadataRecord) {
    this.routerFacade.goToMetadata(record)
  }

  listFavorites(toggled: boolean): void {
    this.searchFacade.setFavoritesOnly(toggled)
  }

  clearSearchAndSort(sort: SortByEnum): void {
    this.searchService.setSortAndFilters({}, sort)
  }

  async clearSearchAndFilterAndSort(customSearchParameters: SearchPreset) {
    const searchFilters = await lastValueFrom(
      this.fieldsService.buildFiltersFromFieldValues(
        customSearchParameters.filters
      )
    )
    this.searchService.setSortAndFilters(
      searchFilters,
      customSearchParameters.sort as SortByEnum
    )
  }

  // specific geocat
  updateLocationFilter() {
    this.locationSearch.trigger()
  }
  updateTextFilter() {
    this.textSearch.trigger()
  }
}
