# ES6 Boilerplate

ES6 Boilerplate.

Built with [A-Frame](https://aframe.io).

## About

This is just my personal AFrame starter template with some basic build steps
included.

## Setup

```sh
npm install
npm run start
```

## Developing

While you're actively working on code, you may want to run the `watch` command.
This will continuously rebuild your bundle for you as you make changes. Note
that this must be run _in addition to_, not instead of, `run`.

## Building and Releasing

Put your JS source files into the `src` directory however you would like, just
make sure to include them in the top-level `index.js` file.  You can include
your files using either `import` or `require` syntax:

```javascript
import "./src/my-component.js"

require("./src/my-component.js");
```

When you want to bundle your included JS files into `build/bundle.js` just call
`npm run build` from the command line. If you'd prefer a minified version, call
`npm run release`. This will create the file `build/bundle.min.js`. If you want
to use the minified version in your scene, be sure to update the script
reference in `index.html`.


## A-Frame Version

The `package.json` file is locking the A-Frame version to 0.8.2, which is the
latest stable release as of this writing. To update to a different stable
version, just update the pin. You'll need to rebuild afterwards to make sure
that the bundled javascript has the latest. If you'd prefer to work from
`master` instead, just replace this line:

```json
"aframe": "^0.8.2"
```

With this one:

```json
"aframe": "github:aframevr/aframe#master"
```


