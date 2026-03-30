A mirror of every asset retrieved by the client from Reddit can also can be found at `static.qudot.app/collectibles/*`. The mirror serves as a backup in case Reddit deletes the assets.

All preview mirrors (renders of the collectible in the PNG format) can be found at `static.qudot.app/collectibles/previews/{id}.png` and backgrounds at `static.qudot.app/collectibles/backgrounds/{id}.png`.

For example, a specific preview image on Reddit would be https://i.redd.it/snoovatar/avatars/basic/f04e6639-5aa5-4a34-9f88-e7d65d7b7dbe.png, which means that the mirror is at https://static.qudot.app/collectibles/previews/f04e6639-5aa5-4a34-9f88-e7d65d7b7dbe.png.

The same applies to background, e.g. https://i.redd.it/snoovatar/snoo_assets/J3Zku-C3wXE_Artboard_157.png and https://static.qudot.app/collectibles/backgrounds/J3Zku-C3wXE_Artboard_157.png.

When looking for traits, Reddit has changed the path throughout the program with both `https://i.redd.it/snoovatar/snoo_assets/${id}.svg` and `https://i.redd.it/snoovatar/snoo_assets/submissions/${id}.svg` being used depending on when the Collectible was made.

For the sake of simplicity, the mirror will have all the traits available at one path, meaning that all the traits can be found at `static.qudot.app/collectibles/traits/{id}.svg`. The trait `id` is parsed using the `parseTraits(string[])` function in `src/app/collectibles/[id]/CollectibleViewer.tsx`.
