copy-pasta
==========


Command line tool for copying minified contents of files.

## usage
```
npm install copy-pasta
copy-pasta path/to/my/file.ext
```

### For parameters run:
```
copy-pasta -h
```

Partial support for watching the file, writing on save.
```
copy-pasta myFile.js -l
```

## Todos
1. refactor to use vinyl
2. multi-file, directory/glob watch/compile
3. js linting
4. no minify flag
