import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TranslateModule } from '@ngx-translate/core'
import { MapContext } from '@geospatial-sdk/core'
import { provideIcons, provideNgIconsConfig } from '@ng-icons/core'
import { matSwipeOutline } from '@ng-icons/material-icons/outline'
import { LangService } from '@geonetwork-ui/util/i18n'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'

// https://map.geo.admin.ch/#/embed?lang=fr&center=2580700.82,1249405.91&z=0.761&bgLayer=ch.swisstopo.pixelkarte-farbe&topic=ech&layers=ch.bafu.luftreinhaltung-stickstoff_kritischer_eintrag@year=2020,f;WMS%7Chttps://geo.so.ch/api/wms%7Cch.so.afu.abbaustellen;WMS%7Chttps://geo.so.ch/api/wms%7Cch.so.arp.agglomerationsprogramme,f;WMTS%7Chttps://geo.so.ch/api/wmts?%7Cch.so.agi.hintergrundkarte_farbig&catalogNodes=ech

const BASE_GEOADMIN_URL =
  'https://map.geo.admin.ch/?bgLayer=ch.swisstopo.pixelkarte-grau'

function isGeoAdminLayerUrl(url: string): boolean {
  return /https:\/\/[a-z]+\.geo\.admin\.ch/.test(url)
}

@Component({
  selector: 'gn-ui-map-container',
  templateUrl: './map-container.component.html',
  styleUrls: ['./map-container.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, TranslateModule],
  providers: [
    provideIcons({ matSwipeOutline }),
    provideNgIconsConfig({
      size: '1.5em',
    }),
  ],
})
export class MapContainerComponent {
  @Input() context: MapContext | null

  get geoadminUrl(): SafeResourceUrl | null {
    const url = new URL(BASE_GEOADMIN_URL)
    if (!this.context) return null

    const layers: string[] = []
    for (const layer of this.context?.layers || []) {
      if (layer.type === 'wms') {
        if (isGeoAdminLayerUrl(layer.url)) {
          layers.push(layer.name)
        } else {
          layers.push(`WMS|${layer.url}|${layer.name}`)
        }
      } else if (layer.type === 'wmts') {
        if (isGeoAdminLayerUrl(layer.url)) {
          layers.push(layer.name)
        } else {
          layers.push(`WMTS|${layer.url}|${layer.name}`)
        }
      } else if (layer.type === 'wfs') {
        // not supported
        // layers.push(`WFS|${layer.url}|${layer.featureType}`)
      } else if (layer.type === 'xyz') {
        // not supported
        //layers.push(layer.url)
      } else if (layer.type === 'geojson') {
        // not supported
        // layers.push(layer.url)
      }
    }
    url.searchParams.set('layers', layers.join(','))
    url.searchParams.set('lang', this.langService.iso2)
    const embedUrl = url
      .toString()
      .replace('map.geo.admin.ch/', 'map.geo.admin.ch/#/embed')
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl)
  }

  constructor(
    private langService: LangService,
    private sanitizer: DomSanitizer
  ) {}
}
