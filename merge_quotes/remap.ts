// Merge legacy "Quote" slice with currently used "QuoteV2" slice
import { PrismicDocData, Remapper } from '../remap'

const remapper: Remapper = {
  filter: (data: PrismicDocData): boolean => {
    return data.data?.body && data.data.body.find((slice:any) => slice.slice_type === 'quote')
  },
  map: ({ filename, data }) => {
    const newData = data.map((node, i) => {
      const newSliceId = JSON.parse(JSON.stringify(node.data.body).replace(/quote\$/g, 'quoteV2$'))
      const newSliceType = JSON.parse(JSON.stringify(newSliceId).replace(/slice_type":"quote"/g, 'slice_type":"quoteV2"'))

      return {
        ...node,
        data: {
          ...node.data,
          body: newSliceType
        }
      }
    })
    console.log(newData.map(n => n.data.body), newData.length)
    return {
      filename,
      data: newData
    }
  }
}

export default remapper
