# json-fs-converter
This module allows to convert json structures in file system, by taking resources from different resources

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

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
```   
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

 

## Contributing
```
1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`  
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request, we'll check 
```

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

* **Gaetano Perrone** - *Initial work* - [PurpleBooth](https://github.com/PurpleBooth)

See also the list of [contributors](https://github.com/giper45/json-fs-converter/graphs/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
