import { Component, EventEmitter, Input, Output } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { AutocompleteItem } from '@geonetwork-ui/ui/inputs'
import { TranslateModule } from '@ngx-translate/core'
import { Observable } from 'rxjs'
import { LocationSearchComponent } from './location-search.component'
import { LocationSearchService } from './location-search.service'
import { SearchFacade } from '../state/search.facade'
import { LocationBbox } from './location-search-result.model'

@Component({
  selector: 'gn-ui-autocomplete',
  template: ` <div></div>`,
})
class MockAutoCompleteComponent {
  @Input() placeholder: string
  @Input() action: (value: string) => Observable<AutocompleteItem[]>
  @Input() value?: AutocompleteItem
  @Input() clearOnSelection = false
  @Input() icon = 'search'
  @Input() displayWithFn
  @Output() itemSelected = new EventEmitter<AutocompleteItem>()
  @Output() inputSubmitted = new EventEmitter<string>()
}

const LOCATIONS_FIXTURE: LocationBbox[] = [
  {
    bbox: [8.446892, 47.319034, 8.627209, 47.43514],
    label: 'Zurigo (ZH)',
  },
  {
    bbox: [8.446892, 47.319034, 8.627209, 47.43514],
    label: 'Zurich (ZH)',
  },
]

class LocationSearchServiceMock {
  getLocationSearch = jest.fn()
}
class SearchFacadeMock {
  setLocationFilter = jest.fn()
}

describe('LocationSearchComponent', () => {
  let component: LocationSearchComponent
  let fixture: ComponentFixture<LocationSearchComponent>
  let service: LocationSearchService
  let facade: SearchFacade

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LocationSearchComponent, MockAutoCompleteComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: LocationSearchService, useClass: LocationSearchServiceMock },
        { provide: SearchFacade, useClass: SearchFacadeMock },
      ],
    }).compileComponents()

    service = TestBed.inject(LocationSearchService)
    facade = TestBed.inject(SearchFacade)
    fixture = TestBed.createComponent(LocationSearchComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  describe('#displayWithFn', () => {
    it('returns the label without html', () => {
      const result = component.displayWithFn(LOCATIONS_FIXTURE[0])

      expect(result).toBe('Zurigo (ZH)')
    })
  })
  describe('#autoCompleteAction', () => {
    beforeEach(() => {
      component.autoCompleteAction('test query')
    })

    it('calls the location search service', () => {
      expect(service.getLocationSearch).toHaveBeenCalledWith('test query')
    })
  })

  describe('#handleItemSelection', () => {
    beforeEach(() => {
      component.handleItemSelection(LOCATIONS_FIXTURE[0])
    })

    it('calls the search facade with label and bbox', () => {
      expect(facade.setLocationFilter).toHaveBeenCalledWith(
        'Zurigo (ZH)',
        [8.446892, 47.319034, 8.627209, 47.43514]
      )
    })
  })
})
