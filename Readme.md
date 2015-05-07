# tokenize-stache

transform stream to tokenize mustache.

# example

``` js
var fs = require('fs');
var tokenize = require('tokenize-stache');
var through = require('through2');

fs.createReadStream(__dirname + '/table.html')
  .pipe(tokenize())
  .pipe(through.obj(function (row, enc, next) {
    console.log(row);
    next();
  }))
;
```

this html:

``` html
<table cols=3>
  {#fruits}
    <tr>
      <td bgcolor="blue">{name}</td>
      {#proteins}<td>{name}</td>{/proteins}
    </tr>
  {/fruits}
</table>
```

generates this output:

```
[ 'open', 'table', { cols: '3' } ]
[ 'text', '\n  ' ]
[ 'section:open', 'fruits' ]
[ 'text', '\n    ' ]
[ 'open', 'tr', {} ]
[ 'text', '\n      ' ]
[ 'open', 'td', { bgcolor: 'blue' } ]
[ 'variable', 'name' ]
[ 'close', 'td' ]
[ 'text', '\n      ' ]
[ 'section:open', 'proteins' ]
[ 'open', 'td', {} ]
[ 'variable', 'name' ]
[ 'close', 'td' ]
[ 'section:close', 'proteins' ]
[ 'text', '\n    ' ]
[ 'close', 'tr' ]
[ 'text', '\n  ' ]
[ 'section:close', 'fruits' ]
[ 'text', '\n' ]
[ 'close', 'table' ]
```

# api

## var t = tokenize()

Returns a transform stream `t` that takes stache input and produces rows of output.

The output rows are of the form:

* `[ name, tag|text [, attrs] ]`

The types of names are:

* open
* close
* text
* section:open
* section:close
* variable

# license

mit