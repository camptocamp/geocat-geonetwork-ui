import { ChangeDetectionStrategy, DebugElement } from '@angular/core'
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { UtilSharedModule } from '@geonetwork-ui/util/shared'
import { ThumbnailComponent } from './thumbnail.component'

describe('ThumbnailComponent', () => {
  let component: ThumbnailComponent
  let fixture: ComponentFixture<ThumbnailComponent>
  let de: DebugElement

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UtilSharedModule],
      declarations: [ThumbnailComponent],
    })
      .overrideComponent(ThumbnailComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(ThumbnailComponent)
    component = fixture.componentInstance
    de = fixture.debugElement
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  describe('<img> element', () => {
    describe('When no url is given', () => {
      let img
      beforeEach(fakeAsync(() => {
        component.thumbnailUrl = undefined
        fixture.detectChanges()
        img = de.query(By.css('img'))
        tick(10)
      }))

      it('is displayed, with a placeholder src', () => {
        expect(img.nativeElement.src).not.toEqual('')
      })
      it('sets object cover to scale-down', () => {
        expect(img.nativeElement.style.objectFit).toEqual('scale-down')
      })
    })
    describe('When an url is given and no fit is set', () => {
      const url = 'http://test.com/img.png'
      let img
      beforeEach(() => {
        component.thumbnailUrl = url
        fixture.detectChanges()
        img = de.query(By.css('img'))
      })
      it('is displayed', () => {
        expect(img).toBeTruthy()
      })
      it('url attribute as url @Input', () => {
        expect(img.nativeElement.src).toEqual(url)
      })
      it('sets object cover to cover', () => {
        expect(img.nativeElement.style.objectFit).toEqual('cover')
      })
      it('sets img height to 100%', () => {
        expect(img.nativeElement.classList.contains('h-full')).toBeTruthy()
      })
    })
    describe('When an url is given and fit is set to "contain"', () => {
      const url = 'http://test.com/img.png'
      let img
      beforeEach(() => {
        component.thumbnailUrl = url
        component.fit = 'contain'
        fixture.detectChanges()
        img = de.query(By.css('img'))
      })
      it('is displayed', () => {
        expect(img).toBeTruthy()
      })
      it('url attribute as url @Input', () => {
        expect(img.nativeElement.src).toEqual(url)
      })
      it('sets object cover to contain', () => {
        expect(img.nativeElement.style.objectFit).toEqual('contain')
      })
      it('sets img height to 80%', () => {
        expect(img.nativeElement.classList.contains('h-4/5')).toBeTruthy()
      })
    })
  })
  describe('When no url is given and a custom placeholder is provided', () => {
    const placeholderUrl = 'http://localhost/assets/img/placeholder.svg'
    let img
    beforeEach(() => {
      component.placeholderUrl = placeholderUrl
      component.thumbnailUrl = undefined
      fixture.detectChanges()
      img = de.query(By.css('img'))
    })
    it('is displayed, with custom placeholder src', () => {
      expect(img.nativeElement.src).toEqual(placeholderUrl)
    })
    it('sets object cover to scale-down', () => {
      expect(img.nativeElement.style.objectFit).toEqual('scale-down')
    })
  })
  describe('broken image url', () => {
    const url = 'http://test.com/img.png'
    const placeholderUrl = 'http://localhost/assets/img/placeholder.png'
    let img
    beforeEach(() => {
      component.thumbnailUrl = url
      component.placeholderUrl = placeholderUrl
      fixture.detectChanges()
      img = de.query(By.css('img'))
      img.nativeElement.dispatchEvent(new Event('error'))
      fixture.detectChanges()
    })
    it('uses placeholder img', () => {
      expect(img.nativeElement.src).toEqual(placeholderUrl)
    })
    it('sets object cover to scale-down', () => {
      expect(img.nativeElement.style.objectFit).toEqual('scale-down')
    })
  })
})
