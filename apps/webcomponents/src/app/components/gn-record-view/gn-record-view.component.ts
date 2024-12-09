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
import { Observable } from 'rxjs'
import {
  CatalogRecord,
  OnlineResource,
} from '@geonetwork-ui/common/domain/model/record'

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

  record$: Observable<CatalogRecord>

  constructor(injector: Injector) {
    super(injector)
  }

  ngOnInit() {
    super.ngOnInit()
    // todo
    this.record$ = this.recordsRepository.getRecord(this.recordId)
  }

  getDownloads(onlineResources: OnlineResource[]) {
    return onlineResources.filter((d) => d.type === 'download')
  }
  getAPIs(onlineResources: OnlineResource[]) {
    return onlineResources.filter((d) => d.type === 'service')
  }
  getLinks(onlineResources: OnlineResource[]) {
    return onlineResources.filter((d) => d.type === 'link')
  }
}
