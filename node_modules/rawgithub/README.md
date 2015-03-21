# rawgithub [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url]


## Information

<table>
<tr>
<td>Package</td>
<td>rawgithub</td>
</tr>
<tr>
<td>Description</td>
<td>Get raw files from github repos</td>
</tr>
<tr>
<td>Node Version</td>
<td>>= 0.10</td>
</tr>
</table>

## Usage

## Install

```
npm install rawgithub --save

```
## Example

```js

var rawgithub = require('rawgithub');

var url = 'https://github.com/stevelacy/rawgithub/blob/master/README.md';
rawgithub(url, function(err, data){
  // => returns the file contents as a string
});


```

## Options
`Type: object`


Defaults:

    base: 'https://raw.githubusercontent.com'
    host: 'github.com'



## LICENSE

(MIT License)

Copyright (c) 2014 Steve Lacy <me@slacy.me>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.



[npm-url]: https://npmjs.org/package/rawgithub
[npm-image]: http://img.shields.io/npm/v/rawgithub.svg

[travis-url]: https://travis-ci.org/stevelacy/rawgithub
[travis-image]: https://travis-ci.org/stevelacy/rawgithub.png?branch=master
