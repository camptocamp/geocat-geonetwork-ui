import { TestBed } from '@angular/core/testing'
import { LocationSearchService } from './location-search.service'
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing'

const RESULT_FIXTURE = [
  {
    attrs: {
      detail: 'zurigo zh',
      featureId: '261',
      geom_quadindex: '030003',
      geom_st_box2d: 'BOX(8.446892 47.319034,8.627209 47.43514)',
      label: '<b>Zurigo (ZH)</b>',
      lat: 47.37721252441406,
      lon: 8.527311325073242,
      num: 1,
      objectclass: '',
      origin: 'gg25',
      rank: 2,
      x: 8.527311325073242,
      y: 47.37721252441406,
      zoomlevel: 4294967295,
    },
    id: 153,
    weight: 6,
  },
  {
    attrs: {
      detail: 'zurich zh',
      featureId: '261',
      geom_quadindex: '030003',
      geom_st_box2d: 'BOX(8.446892 47.319034,8.627209 47.43514)',
      label: '<b>Zurich (ZH)</b>',
      lat: 47.37721252441406,
      lon: 8.527311325073242,
      num: 1,
      objectclass: '',
      origin: 'gg25',
      rank: 2,
      x: 8.527311325073242,
      y: 47.37721252441406,
      zoomlevel: 4294967295,
    },
    id: 154,
    weight: 6,
  },
]

describe('LocationSearchService', () => {
  let service: LocationSearchService
  let httpController: HttpTestingController

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    }).compileComponents()
    service = TestBed.inject(LocationSearchService)
    httpController = TestBed.inject(HttpTestingController)
  })

  afterEach(() => {
    httpController.verify()
  })

  it('should create', () => {
    expect(service).toBeTruthy()
  })

  describe('request successful', () => {
    let items
    beforeEach(() => {
      const customQuery = 'simple query'
      service.queryLocations(customQuery).subscribe((r) => (items = r))
      httpController
        .match((request) => {
          return (
            request.url.startsWith(
              'https://api3.geo.admin.ch/rest/services/api/SearchServer'
            ) && request.url.includes('simple+query')
          )
        })[0]
        .flush({ results: RESULT_FIXTURE })
    })
    it('should return a list of locations with bbox', () => {
      expect(items).toStrictEqual([
        {
          bbox: [8.446892, 47.319034, 8.627209, 47.43514],
          label: 'Zurigo (ZH)',
        },
        {
          bbox: [8.446892, 47.319034, 8.627209, 47.43514],
          label: 'Zurich (ZH)',
        },
      ])
    })
  })

  describe('request fails', () => {
    it('should send a request to geo admin api with query', (done) => {
      const customQuery = 'simple query'
      service.queryLocations(customQuery).subscribe((data) => {
        expect(data).toStrictEqual([])
        done()
      })

      httpController
        .match((request) => {
          return (
            request.url.startsWith(
              'https://api3.geo.admin.ch/rest/services/api/SearchServer'
            ) && request.url.includes('simple+query')
          )
        })[0]
        .flush('error!!!', { status: 404, statusText: 'Not found' })
    })
  })
})
