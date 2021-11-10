import { Remapper } from "../remap";

const remapper: Remapper = {
  filter: (doc) => doc.data.type === 'webcomics',
  map: ({ filename, data }) => {
    return {
      filename,
      data: {
        ...data,
        body: [
          {
            key: 'editorialImageGallery',
            value: {
              repeat: [{
                image: data.image
              }],
              'non-repeat': {}
            },
            label: "standalone"
          }
        ],
        format: {
          id: 'W7d_ghAAALWY3Ujc',
          wioUrl: 'wio://documents/W7d_ghAAALWY3Ujc'
        },
      }
    }
  }
}

export default remapper
