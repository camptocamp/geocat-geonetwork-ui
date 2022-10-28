import { DatasetRecord, RecordStatus, Role } from '../model'

export const GEOCAT_CH_DATASET_RECORD: DatasetRecord = {
  uniqueIdentifier: '8698bf0b-fceb-4f0f-989b-111e7c4af0a4',
  kind: 'dataset',
  ownerOrganisation: {
    name: 'Bundesamt für Raumentwicklung',
  },
  contacts: [
    {
      email: 'rolf.giezendanner@are.admin.ch',
      role: Role.POINT_OF_CONTACT,
      organisation: {
        name: 'Bundesamt für Raumentwicklung',
      },
    },
    {
      email: 'info@are.admin.ch',
      role: Role.OWNER,
      organisation: {
        name: 'Bundesamt für Raumentwicklung',
      },
    },
  ],
  recordCreated: new Date('2022-02-22T19:40:06'),
  recordUpdated: new Date('2022-02-22T19:40:06'),
  datasetCreated: new Date('1999-01-01T00:00:00'),
  datasetUpdated: new Date('2009-01-01'),
  title: 'Alpenkonvention',
  abstract: `Perimeter der Alpenkonvention in der Schweiz. Die Alpenkonvention ist ein völkerrechtlicher Vertrag zwischen den acht Alpenländern Deutschland, Frankreich, Italien, Liechtenstein, Monaco, Österreich, Schweiz, Slowenien sowie der Europäischen Union. Das Ziel des Übereinkommens ist der Schutz der Alpen durch eine sektorübergreifende, ganzheitliche und nachhaltige Politik.`,
  overviews: [],
  themes: [
    'Aufbewahrungs- und Archivierungsplanung AAP - Bund',
    'Geobasisdaten',
    'e-geo.ch',
    'opendata.swiss',
    'Nachhaltige Entwicklung',
    'Raumplanung',
    'Bergschutz',
    'Bodenschutz',
    'Umweltpolitik',
    'Umweltpolitik',
    'Verkehr',
    'Verkehr',
    'Verkehr',
    'Umweltüberwachung',
    'Verwaltungseinheiten',
    'BGDI Bundesgeodaten-Infrastruktur',
  ],
  keywords: [],
  spatialRepresentation: 'vector',
  distributions: [
    {
      linkUrl: new URL(
        'https://map.geo.admin.ch/?layers=ch.are.alpenkonvention'
      ),
      name: 'Vorschau map.geo.admin.ch',
      description: 'Vorschau map.geo.admin.ch',
    },
    {
      linkUrl: new URL(
        'https://www.are.admin.ch/are/de/home/laendliche-raeume-und-berggebiete/internationale-zusammenarbeit/alpenkonvention.html'
      ),
      description: 'Webseite des ARE über die Alpenkonvention',
    },
    {
      downloadUrl: new URL(
        'https://data.geo.admin.ch/browser/index.html#/collections/ch.are.alpenkonvention'
      ),
      description: 'Download von data.geo.admin.ch',
      mimeType: 'x-gis/x-shapefile',
    },
    {
      accessServiceUrl: new URL(
        'http://wms.geo.admin.ch/?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities&lang=de'
      ),
      accessServiceProtocol: 'wms',
      identifierInService: 'ch.are.alpenkonvention',
      name: 'ch.are.alpenkonvention',
      description: 'WMS Dienst von geo.admin.ch',
    },
    {
      downloadUrl: new URL(
        'https://www.are.admin.ch/are/de/home/raumentwicklung-und-raumplanung/grundlagen-und-daten/minimale-geodatenmodelle/alpenkonvention.html'
      ),
      description: 'Minimales Geodatenmodell in INTERLIS 2.3',
      mimeType: 'x-gis/x-shapefile',
    },
    {
      linkUrl: new URL(
        'http://map.are.admin.ch/?Y=660000&X=190000&zoom=1&bgLayer=ch.swisstopo.pixelkarte-grau&layers=ch.are.alpenkonvention&layers_opacity=0.2&layers_visibility=true&lang=de'
      ),
      description: 'Web-GIS ARE',
    },
    {
      linkUrl: new URL('http://www.alpconv.org'),
      description: 'Offizielle Homepage der Alpenkonvention',
    },
    {
      linkUrl: new URL(
        'http://map.geo.admin.ch/?selectedNode=LT1_1&Y=660000&X=190000&zoom=1&bgLayer=ch.swisstopo.pixelkarte-farbe&layers=ch.are.alpenkonvention&layers_opacity=0.6&layers_visibility=true&lang=de'
      ),
      description: 'Die Alpenkonvention im Bundesgeoportal',
    },
    {
      linkUrl: new URL('http://www.admin.ch/ch/d/sr/0_700_1/app1.html'),
      description:
        'Liste der administrativen Einheiten des Alpenraumes in der schweizerischen Eidgenossenschaft',
    },
    {
      accessServiceUrl: new URL(
        'https://api3.geo.admin.ch/rest/services/api/MapServer/ch.are.alpenkonvention'
      ),
      accessServiceProtocol: 'esriRest',
      name: 'RESTful API von geo.admin.ch',
      description: 'RESTful API von geo.admin.ch',
    },
    {
      linkUrl: new URL(
        'https://opendata.swiss/de/perma/8698bf0b-fceb-4f0f-989b-111e7c4af0a4@bundesamt-fur-raumentwicklung-are'
      ),
      name: 'Permalink opendata.swiss',
      description: 'Permalink opendata.swiss',
    },
  ],
  lineage:
    'Digitalisiert nach den administrativen Einheiten der Schweiz, die im Anhang des Übereinkommens erscheinen.',
  accessConstraints: [],
  useLimitations: [],
  licenses: [
    {
      text: "Licence passée entre l'Office fédéral de l'environnement (OFEV), et le canton de Fribourg, représenté par la Coordination SIT (SITel)",
    },
  ],
  // data quality?
  spatialExtents: [],
  temporalExtents: [],
  status: RecordStatus.COMPLETED,
  updateFrequency: 'asNeeded',
}
