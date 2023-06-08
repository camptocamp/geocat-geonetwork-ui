import { ChangeDetectionStrategy, Component } from '@angular/core'
import { AutocompleteItem } from '@geonetwork-ui/ui/inputs'
import { LocationSearchService } from './location-search.service'
import { LocationBbox } from './location-search-result.model'
import { SearchFacade } from '../state/search.facade'

@Component({
  selector: 'gn-ui-location-search',
  templateUrl: './location-search.component.html',
  styleUrls: ['./location-search.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationSearchComponent {
  constructor(
    private locationSearchService: LocationSearchService,
    private searchFacade: SearchFacade
  ) {}

  displayWithFn = (location: LocationBbox): string => {
    return location.label
  }

  autoCompleteAction = (query: string) => {
    return this.locationSearchService.getLocationSearch(query)
  }

  handleItemSelection(item: AutocompleteItem) {
    const location = item as LocationBbox
    this.searchFacade.setLocationFilter(location.label, location.bbox)
  }

  handleInputSubmission(inputValue: string) {
    console.log('inputValue', inputValue)
  }
}
