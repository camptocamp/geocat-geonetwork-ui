import { importProvidersFrom, NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppComponent } from './app.component'
import { FeatureMapModule } from '@geonetwork-ui/feature/map'
import { ThemeService } from '@geonetwork-ui/util/shared'
import { TranslateModule } from '@ngx-translate/core'
import {
  TRANSLATE_DEFAULT_CONFIG,
  UtilI18nModule,
} from '@geonetwork-ui/util/i18n'
import { MetaReducer, StoreModule } from '@ngrx/store'
import { StoreDevtoolsModule } from '@ngrx/store-devtools'
import { EffectsModule } from '@ngrx/effects'
import { storeFreeze } from 'ngrx-store-freeze'
import { environment } from '../environments/environment'
import { provideRepositoryUrl } from '@geonetwork-ui/api/repository'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { provideGn4 } from '@geonetwork-ui/api/repository'
import { FeatureAuthModule } from '@geonetwork-ui/feature/auth'
import { FeatureCatalogModule } from '@geonetwork-ui/feature/catalog'

export const metaReducers: MetaReducer<any>[] = !environment.production
  ? [storeFreeze]
  : []

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FeatureMapModule,
    TranslateModule.forRoot(TRANSLATE_DEFAULT_CONFIG),
    UtilI18nModule,
    StoreModule.forRoot({}, { metaReducers }),
    StoreDevtoolsModule.instrument(),
    EffectsModule.forRoot(),
    FeatureCatalogModule,
  ],
  providers: [
    importProvidersFrom(FeatureAuthModule),
    provideRepositoryUrl('/geonetwork/srv/api'),
    provideGn4(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {
    ThemeService.applyCssVariables('#e73f51', '#c2e9dc', '#212029', '#fdfbff')
  }
}
