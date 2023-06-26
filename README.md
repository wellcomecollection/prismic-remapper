# Prismic Remapper

To remap content, export the documents from Prismic using https://prismic.io/docs/import-export#export-tool, and dump them all into `./.dist`.

Create a new folder for your new remapping action, and add a `./<ACTION>/remap.js` file, where you'll build your filter and remapper.

Remappers should export a `filter` and `map` function, both of which take a
`{filename: string, doc: PrismicDocument}` object.

Once you're ready, run `yarn remap --id <ACTION>`

This will create two new folders inside `./<ACTION>/`: `premapped` and `remapped`, containing all the JSON files from `.dist/`, before and after remapping. 
It will also create two new JSON files, `before.json` and `after.json`, both containing an array made of all the JSON files from their respective folders.


<!-- Everything below this line part hasn't been tested in a few years and is an informed theory, so might need updating by the next dev who gives it a try. -->
You'll need to zip `remapped` and import it in Prismic using [their Import tool](https://prismic.io/docs/import-export#import-tool).


## It all broke - get me out of here ＼(º □ º l|l)/
As explained above, the premapped content gets saved into the remapper folder, under `premapped`.
Just zip that up and upload it to Prismic.

---

An example process of this could be

* Add new fields
* Write content mappers
* Write parsers for new fields
* PR
* Remap content to new fields and import into Prismic
* Remove old fields
* PR

---

# TODO
* Batch sizing (we don't have enough content for this to be an issue).
* Think about version control of content to avoid not being able to roll back.
