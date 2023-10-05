import { Component } from '@angular/core'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { LANG_2_TO_3_MAPPER } from '@geonetwork-ui/util/i18n'
import { getGlobalConfig } from '@geonetwork-ui/util/app-config'
import { LanguageSwitcherComponent } from '@geonetwork-ui/ui/catalog'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'datahub-geocat-header',
  templateUrl: './geocat-header.component.html',
  imports: [CommonModule, TranslateModule, LanguageSwitcherComponent],
  standalone: true,
})
export class GeocatHeaderComponent {
  showLanguageSwitcher = getGlobalConfig().LANGUAGES?.length > 0

  constructor(private translate: TranslateService) {}

  get docLink() {
    return `https://www.info.geocat.ch`
  }

  get gnLinkAdmin() {
    return `/geonetwork/srv/${
      LANG_2_TO_3_MAPPER[this.translate.currentLang] || 'eng'
    }/catalog.edit#/board`
  }

  get gnLinkGeneral() {
    return `/geonetwork/srv/${
      LANG_2_TO_3_MAPPER[this.translate.currentLang] || 'eng'
    }/catalog.search#/home`
  }
}
