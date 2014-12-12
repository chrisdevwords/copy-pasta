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
1. by default loop over every .js file in the directory and copy/minify all to one file/clipboard glob
2. multi-file sass support