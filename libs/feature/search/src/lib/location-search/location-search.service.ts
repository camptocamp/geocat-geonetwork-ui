import { Injectable } from '@angular/core'
import {
  LocationBbox,
  LocationSearchResult,
} from './location-search-result.model'
import { catchError, map } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http'
import { Observable, of } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class LocationSearchService {
  constructor(private http: HttpClient) {}

  private mapResultToLocation(
    resultItem: LocationSearchResult['results'][number]
  ) {
    return {
      label: resultItem.attrs.label.replace(/<[^>]*>?/gm, ''),
      bbox: resultItem.attrs.geom_st_box2d
        .match(/[-\d.]+/g)
        .map(Number) as LocationBbox['bbox'],
    }
  }

  queryLocations(query: string): Observable<LocationBbox[]> {
    const requestUrl = new URL(
      'https://api3.geo.admin.ch/rest/services/api/SearchServer'
    )

    requestUrl.search = new URLSearchParams({
      origins: 'kantone,gg25',
      type: 'locations',
      sr: '4326',
      lang: 'fr',
      searchText: query,
    }).toString()
    return this.http.get<LocationSearchResult>(requestUrl.toString()).pipe(
      map((responseData) => responseData.results.map(this.mapResultToLocation)),
      catchError((error) => {
        console.warn('Location search failed')
        return of([])
      })
    )
  }
}
