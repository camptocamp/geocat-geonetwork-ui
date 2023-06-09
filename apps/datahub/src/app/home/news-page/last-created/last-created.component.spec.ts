import { ComponentFixture, TestBed } from '@angular/core/testing'
import { summaryHits } from '@geonetwork-ui/util/shared/fixtures'
import { of } from 'rxjs'
import { LastCreatedComponent } from './last-created.component'

import { NO_ERRORS_SCHEMA } from '@angular/core'
import { SearchFacade } from '@geonetwork-ui/feature/search'
import { RouterFacade } from '@geonetwork-ui/feature/router'

class SearchFacadeMock {
  init = jest.fn()
  results$ = of(summaryHits)
  setPagination = jest.fn()
  setSortBy = jest.fn()
  setConfigRequestFields = jest.fn()
  setResultsLayout = jest.fn()
}
class RouterFacadeMock {
  goToMetadata = jest.fn()
}

describe('LastCreatedComponent', () => {
  let component: LastCreatedComponent
  let fixture: ComponentFixture<LastCreatedComponent>
  let facade: SearchFacade

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LastCreatedComponent],
      providers: [
        {
          provide: SearchFacade,
          useClass: SearchFacadeMock,
        },
        {
          provide: RouterFacade,
          useClass: RouterFacadeMock,
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(LastCreatedComponent, {
        set: {
          providers: [], // remove component providers to be able to run tests
        },
      })
      .compileComponents()
    facade = TestBed.inject(SearchFacade)
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(LastCreatedComponent)
    component = fixture.componentInstance
  })

  it('should create', () => {
    fixture.detectChanges()
    expect(component).toBeTruthy()
  })

  describe('get results on init', () => {
    beforeEach(() => {
      fixture.detectChanges()
    })

    it('Should set the correct params in the facade', () => {
      expect(facade.setPagination).toHaveBeenCalledWith(0, 10)
      expect(facade.setSortBy).toHaveBeenCalledWith('-createDate')
      expect(facade.setConfigRequestFields).toHaveBeenCalledWith({
        includes: expect.arrayContaining([
          'uuid',
          'id',
          'title',
          'createDate',
          'changeDate',
        ]),
      })
    })
  })
})
