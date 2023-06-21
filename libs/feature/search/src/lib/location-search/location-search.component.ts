import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core'
import {
  AutocompleteComponent,
  AutocompleteItem,
} from '@geonetwork-ui/ui/inputs'
import { LocationSearchService } from './location-search.service'
import { LocationBbox } from './location-search-result.model'
import { SearchFacade } from '../state/search.facade'
import { combineLatest, of } from 'rxjs'
import { map } from 'rxjs/operators'
import { SearchService } from '../utils/service/search.service'

@Component({
  selector: 'gn-ui-location-search',
  templateUrl: './location-search.component.html',
  styleUrls: ['./location-search.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationSearchComponent {
  // specific geocat
  @Output() inputSubmitted = new EventEmitter<void>()
  @ViewChild(AutocompleteComponent) autocomplete: AutocompleteComponent

  currentLocation$ = combineLatest([
    this.searchFacade.locationFilterLabel$,
    this.searchFacade.locationFilterBbox$,
  ]).pipe(map(([label, bbox]) => ({ label, bbox })))

  constructor(
    private locationSearchService: LocationSearchService,
    private searchFacade: SearchFacade,
    private searchService: SearchService
  ) {}

  displayWithFn = (location: LocationBbox): string => {
    return location?.label
  }

  autoCompleteAction = (query: string) => {
    if (!query) return of([])
    return this.locationSearchService.queryLocations(query)
  }

  handleItemSelection(item: AutocompleteItem) {
    this.inputSubmitted.emit() // specific geocat
    const location = item as LocationBbox
    this.searchService.setLocationFilter(location)
  }

  handleInputSubmission(inputValue: string) {
    this.inputSubmitted.emit() // specific geocat
    if (inputValue === '') {
      this.searchService.clearLocationFilter()
      return
    }
    this.locationSearchService.queryLocations(inputValue).subscribe((item) => {
      if (item.length === 0) {
        console.warn(`No location found for the following query: ${inputValue}`)
        return
      }
      this.searchService.setLocationFilter(item[0])
    })
  }

  // specific geocat
  trigger() {
    const inputValue = this.autocomplete.control.value
    if (typeof inputValue !== 'string') {
      return
    }
    if (inputValue === '') {
      this.searchService.clearLocationFilter()
      return
    }
    this.locationSearchService.queryLocations(inputValue).subscribe((item) => {
      if (item.length === 0) {
        console.warn(`No location found for the following query: ${inputValue}`)
        return
      }
      this.searchService.setLocationFilter(item[0])
    })
  }
}
