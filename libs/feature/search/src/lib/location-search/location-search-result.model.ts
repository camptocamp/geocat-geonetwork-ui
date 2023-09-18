export interface LocationSearchResult {
  results: {
    attrs: {
      detail: string
      featureId: string
      geom_quadindex: string
      geom_st_box2d: string
      label: string
      lat: number
      lon: number
      num: number
      objectclass: string
      origin: string
      rank: number
      x: number
      y: number
      zoomlevel: number
    }
    id: number
    weight: number
  }[]
}

export interface LocationBbox {
  label: string
  bbox: [number, number, number, number]
}
