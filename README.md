# json-fs-converter
This module allows to convert json structures in file system, by taking resources from different resources

## Getting Started

### Installing

```
npm install --save json-fs-converter 
```

Then you can use the module by importing the library. 


## Running the tests

Unit Tests: 
```
npm test
```  
Integration test: 
``` 
npm run integration  
``` 

### Usage

To use the library: 
``` javascript
var jsonConverter = require('json-fs-converter')
const path = require('path');
const fs = require('fs');
const fakeTmp = '/fakeTmp';
const mock = require('mock-fs')
const singleFile = '{"root" : "/fakeTmp", "name" : "single-test", "structure" : [{"type": "http", "name" : "test.txt", "url": "https://raw.githubusercontent.com/giper45/DockerSecurityPlayground/master/Readme.md"}]}'

mock({
  '/fakeTmp' : {}
})

const mm = jsonConverter(singleFile);
mm.run((err) => {
  const filename = path.join(fakeTmp, 'single-test', "test.txt");
  let exists = fs.existsSync(filename);
  console.log("Exists? ")
  console.log(exists)
  console.log("File content:");
  const fileContent = fs.readFileSync(filename);
  console.log(fileContent)
  console.log(fileContent.toString())
  mock.restore();
})
```
This code will create the following file structure:  
```bash
/fakeTmp/single-test (directory)
/fakeTmp/single-test/test.txt (file)
```
The library recursively create directories and files.
The module accepts a single object containing:  
- root: the root directory where first directory will be saved 
- name: the name of the directory that will be created; in this directory files will be saved  
- List of files: an array containing elements that depends on the type of driver

The library detect the type of driver to use depending on the elements inside the structure array. Available drivers:  
- httpDriver : Download files from webserver; the structure of an element is : 
```javascript
{
  "type": "http",
  "name" : <name_to_save>, // the name of the new created file
  "url": <url_to_download> // the url where the file will be downloaded
}
```
- fsDriver : Download files from filesystem; the structure of an element is : 
```javascript
{
  "type": "fs", //Filesystem driver
  "name" : <name_to_save>, // the name of the new created file
  "filepath": <filepath> // the path where the file will be taken 
}
```
- contentDriver : Write files by content; the structure of an element is : 
```javascript
{
  "type": "content", //Content driver
  "name" : <name_to_save>, // the name of the new created file
  "content": <content> // the content that will be saved in fs
}
```

 

## Contributing
```
1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`  
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request, we'll check 
```


## Authors

* **Gaetano Perrone** - *Initial work* - [giper45](https://github.com/giper45)

See also the list of [contributors](https://github.com/giper45/json-fs-converter/graphs/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
