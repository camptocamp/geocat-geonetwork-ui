import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  Input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core'
import { SearchFacade } from '@geonetwork-ui/feature/search'
import { BaseComponent } from '../base.component'
import { Observable, map } from 'rxjs'
import {
  CatalogRecord,
  OnlineResource,
} from '@geonetwork-ui/common/domain/model/record'
import { ErrorType } from '@geonetwork-ui/ui/elements'

// TODO in this component:
// - Support metadata quality option
// - show data preview

@Component({
  selector: 'wc-gn-record-view',
  templateUrl: './gn-record-view.component.html',
  styleUrls: ['./gn-record-view.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom,
  providers: [SearchFacade],
})
export class GnRecordViewComponent extends BaseComponent implements OnInit {
  @Input() recordId!: string
  record$: Observable<CatalogRecord | null>
  downloads$: Observable<OnlineResource[]>
  links$: Observable<OnlineResource[]>
  apis$: Observable<OnlineResource[]>
  errorType = ErrorType

  constructor(injector: Injector) {
    super(injector)
  }

  ngOnInit() {
    super.ngOnInit()
    this.record$ = this.recordsRepository.getRecord(this.recordId)

    this.downloads$ = this.record$.pipe(
      map((record) => this.getDownloads(record?.onlineResources || []))
    )
    this.links$ = this.record$.pipe(
      map((record) => this.getLinks(record?.onlineResources || []))
    )
    this.apis$ = this.record$.pipe(
      map((record) => this.getAPIs(record?.onlineResources || []))
    )
  }

  getDownloads(onlineResources: OnlineResource[]): OnlineResource[] {
    return onlineResources.filter((resource) => resource.type === 'download')
  }

  getLinks(onlineResources: OnlineResource[]): OnlineResource[] {
    return onlineResources.filter((resource) => resource.type === 'link')
  }

  getAPIs(onlineResources: OnlineResource[]): OnlineResource[] {
    return onlineResources.filter((resource) => resource.type === 'service')
  }
}
