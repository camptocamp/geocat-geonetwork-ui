import { ComponentFixture, TestBed } from '@angular/core/testing'
import { GeocatHeaderComponent } from './geocat-header.component'
import { TranslateModule } from '@ngx-translate/core'
import { MockBuilder } from 'ng-mocks'

jest.mock('@geonetwork-ui/util/app-config', () => ({
  getGlobalConfig: jest.fn(() => ({
    LANGUAGES: ['de', 'fr'],
  })),
}))

describe('GeocatHeaderComponent', () => {
  let component: GeocatHeaderComponent
  let fixture: ComponentFixture<GeocatHeaderComponent>

  beforeEach(() => MockBuilder(GeocatHeaderComponent))

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
    })
    fixture = TestBed.createComponent(GeocatHeaderComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
