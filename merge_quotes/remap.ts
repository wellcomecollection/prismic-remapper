// Merge legacy "Quote" slice with currently used "QuoteV2" slice
import { PrismicDocData, Remapper } from '../remap'

// WIP
const remapper: Remapper = {
  filter: ({ data } : { filename: string, data: PrismicDocData }): boolean => {
    return data.body && data.body.find(({ key } : { key: string }) => {
      return !key.indexOf('quote$')
    })
  },
  map: ({ filename, data }: { filename: string, data: PrismicDocData }) => {
    const newSliceType = data.body.map((slice:any) => {
      const newSliceId = JSON.parse(JSON.stringify(slice).replace(/quote\$/g, 'quoteV2$'))
      return JSON.parse(JSON.stringify(newSliceId).replace(/slice_type":"quote"/g, 'slice_type":"quoteV2"'))
    })

    return {
      filename,
      data: newSliceType
    }
  }
}

export default remapper
