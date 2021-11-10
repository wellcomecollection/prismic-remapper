import yargs from 'yargs/yargs';
import { promises as fs } from 'fs';

const { id, logIds } = yargs(process.argv.slice(2)).options({
  id: { type: 'string', demandOption: true },
  logIds: { type: 'boolean', default: false },
}).parseSync();

type PrismicDoc = {
  filename: string
  data: {
    type: string
    tags: string[]
    lang: string
    [key: string]: any
  }
}

export type Remapper = {
  filter: (doc: PrismicDoc) => boolean
  map: (doc: PrismicDoc) => PrismicDoc
}

function json(obj: any) {
  return JSON.stringify(obj, null, 2)
}

async function run() {
  const { filter , map }: Remapper = (await import(`./${id}/remap`)).default;
  
  const files = await fs.readdir('./.dist')

  const docs: PrismicDoc[] = await Promise.all(files
    .filter(filename => filename.endsWith('.json'))
    .map(async filename => {
      const data = (await import(`./.dist/${filename}`)).default
      return { filename, data }
    }));

  // We write the premapped data in case we need to revert
  const filteredDocs = docs.filter(filter)
  await fs.rm(`./${id}/premapped`,  { recursive: true, force: true })
  await fs.mkdir(`./${id}/premapped`)
  await Promise.all(filteredDocs.map(doc => fs.writeFile(`./${id}/premapped/${doc.filename}`, json(doc.data))))

  const mappedDocs = filteredDocs.map(map);
  await fs.rm(`./${id}/remapped`,  { recursive: true, force: true })
  await fs.mkdir(`./${id}/remapped`)
  await Promise.all(mappedDocs.map(doc => fs.writeFile(`./${id}/remapped/${doc.filename}`, json(doc.data))))

  await fs.writeFile(`./${id}/before.json`, json(filteredDocs[0].data))
  await fs.writeFile(`./${id}/after.json`, json(mappedDocs[0].data))

  console.info(`remapped ${mappedDocs.length}`)
}

run();
