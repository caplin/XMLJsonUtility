# XMLJsonUtility

This is [Caplin's](http://www.caplin.com) fork of the [this](http://goessner.net/download/prj/jsonxml/) open source library that provides two functions to convert XML to JSON and JSON to XML.

## Origins
We wrapped the two functions in it's own namespace to avoid introducing two new global functions. We also formatted the code to be (more or less) written in our style. We added JsDoc documentation, extracted inner functions so they are not redefined every time the two functions are called. And we added Jasmine tests. Apart from that, the code is the same as the original.

The original code was created in 2006 by [Stefan Goessner](http://goessner.net) and can be found [here](http://goessner.net/download/prj/jsonxml/).

## How to use
First include the `caplin/core/bootstrap.js` file which will define the `caplin.core` root namespace object, then include whichever file you wish to use.

## How to run the tests
Open `SpecRunner.html` in your browser. This will run the tests in `spec/` with the [Jasmine](http://pivotal.github.io/jasmine/) testing framework.

## License
Licensed under LGPL/2.1. See the [LICENSE](https://github.com/caplin/XMLJsonUtility/blob/master/LICENSE.md) file for details.