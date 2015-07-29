# advance

# how it work

## bundle contruction

a pipeline that:

1. read a file content
2. parse source with acorn
3. find all deps by detecting all require and imports in ast
4. push all deps found to same pipeline
5. apply transform plugins to ast
6. generate source code from ast with escodegen
7. add generated source code to tar file

once there are no more files in pipeline,

1. convert tar file content to base64 string
2. create js file with base lib, containing tar file as a base64 string

## base lib

* It read tar file and save each file content to localstorage,
using file path and bundle name as key

* Each required file is then read from localstorage, with the same semantic as node modules

* We need a way to detect that a module is already installed in localstorage and doesn't need to download full tar file


## the pipeline
```javascript
const p = pipeline(
    readFile,               // { string filename, pipeline pl }  -> { string content, pipeline pl }
    parse,                  // { string content, pipeline pl } -> { string content, pipeline pl, Object ast }
    findDeps,               // { string content, pipeline pl, Object ast } -> { string content, pipeline pl, Object ast }
    ...allOtherTransforms   // { string content, pipeline pl, Object ast } -> { string content, pipeline pl, Object ast }

    bundleFiles
);

p.appendNewFile('path/to/another/file.js');
```

## TODO

- [ ] compose a bundle. Evaluate tar format, json, vanilla js
- [ ] integrate with browserify transforms
- [ ] integrate with babel transforms
- [ ] improve detective to avoid re-parse
