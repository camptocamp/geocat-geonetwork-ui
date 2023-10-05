import { Component } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { LANG_2_TO_3_MAPPER } from '@geonetwork-ui/util/i18n'
import { getGlobalConfig } from '@geonetwork-ui/util/app-config'

@Component({
  selector: 'datahub-geocat-header',
  templateUrl: './geocat-header.component.html',
})
export class GeocatHeaderComponent {
  showLanguageSwitcher = getGlobalConfig().LANGUAGES?.length > 0

  constructor(private translate: TranslateService) {}

  get docLink() {
    return `https://www.geocat.admin.ch/${
      this.translate.currentLang || 'en'
    }/home.html`
  }

  get gnLink() {
    return `/geonetwork/srv/${
      LANG_2_TO_3_MAPPER[this.translate.currentLang] || 'eng'
    }/catalog.edit#/board`
  }
}
