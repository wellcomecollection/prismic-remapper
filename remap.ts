import yargs from 'yargs'
import { promises as fs } from 'fs'

const { id } = yargs(process.argv.slice(2)).options({
  id: { type: 'string', demandOption: true },
  logIds: { type: 'boolean', default: false }
}).parseSync()

export type PrismicDocData = {
  type: string
  tags: string[]
  lang: string
  [key: string]: any
  body: {
    slice_type: string //eslint-disable-line
  }
}

type PrismicDoc = {
  filename: string
  data: PrismicDocData[]
}

export type Remapper = {
  filter: (doc: PrismicDocData) => boolean
  map: (doc: PrismicDoc) => PrismicDoc
}

function json (obj: any) {
  return JSON.stringify(obj, null, 2)
}

async function run () {
  const { filter, map }: Remapper = (await import(`./${id}/remap`)).default

  const files = await fs.readdir('./.dist')

  const docs: PrismicDoc[] = await Promise.all(files
    .filter(filename => filename.endsWith('.json'))
    .map(async filename => {
      const data = (await import(`./.dist/${filename}`)).default
      return { filename, data }
    }))

  // We write the premapped data in case we need to revert
  const filteredDocs = docs[0].data.filter(filter)
  await fs.rm(`./${id}/premapped`, { recursive: true, force: true })
  await fs.mkdir(`./${id}/premapped`)
  await Promise.all(filteredDocs.map(doc => fs.writeFile(`./${id}/premapped/${docs[0].filename}`, json(doc.data))))

  const mappedDocs = ([{ filename: docs[0].filename, data: filteredDocs }]).map(map)
  await fs.rm(`./${id}/remapped`, { recursive: true, force: true })
  await fs.mkdir(`./${id}/remapped`)
  await Promise.all(mappedDocs.map(doc => fs.writeFile(`./${id}/remapped/${doc.filename}`, json(doc.data))))

  await fs.writeFile(`./${id}/before.json`, json(filteredDocs))
  await fs.writeFile(`./${id}/after.json`, json(mappedDocs))

  console.info(`remapped ${mappedDocs.length}`)
}

run()
