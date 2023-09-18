import {
  Meta,
  applicationConfig,
  moduleMetadata,
  StoryObj,
} from '@storybook/angular'
import { AutocompleteComponent } from './autocomplete.component'
import { of, throwError } from 'rxjs'
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { MatIconModule } from '@angular/material/icon'
import { ReactiveFormsModule } from '@angular/forms'
import { TranslateModule } from '@ngx-translate/core'
import { importProvidersFrom } from '@angular/core'
import {
  TRANSLATE_DEFAULT_CONFIG,
  UtilI18nModule,
} from '@geonetwork-ui/util/i18n'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

export default {
  title: 'Inputs/AutocompleteComponent',
  component: AutocompleteComponent,
  decorators: [
    moduleMetadata({
      imports: [
        UtilI18nModule,
        TranslateModule.forRoot(TRANSLATE_DEFAULT_CONFIG),
        MatAutocompleteModule,
        MatIconModule,
        ReactiveFormsModule,
      ],
    }),
    applicationConfig({
      providers: [importProvidersFrom(BrowserAnimationsModule)],
    }),
  ],
} as Meta<AutocompleteComponent>

type AutocompleteComponentWithActionResult = AutocompleteComponent & {
  actionResult: string[]
  actionThrowsError: boolean
}

export const Primary: StoryObj<AutocompleteComponentWithActionResult> = {
  args: {
    placeholder: 'Full text search',
    actionResult: ['Hello', 'world'],
    actionThrowsError: false,
    icon: 'pin_drop',
  },
  argTypes: {
    itemSelected: {
      action: 'itemSelected',
    },
    inputSubmitted: {
      action: 'inputSubmitted',
    },
    actionThrowsError: {
      type: 'boolean',
    },
    icon: {
      control: {
        type: 'select',
        options: ['pin_drop', 'search', 'home'],
      },
    },
  },
  render: (args) => ({
    props: {
      ...args,
      action: () =>
        args.actionThrowsError
          ? throwError(new Error('Something went terribly wrong!'))
          : of(args.actionResult),
    },
  }),
}
