import Baobab from 'baobab';
// Considering the following tree
var tree = new Baobab({
  palette: {
    name: 'fancy',
    colors: ['blue', 'yellow', 'green']
  }
});

// Creating a cursor on the palette
var paletteCursor = tree.select('palette');
console.log(paletteCursor.get());


// Creating a cursor on the palette's colors
var colorsCursor = tree.select('palette', 'colors');
console.log(colorsCursor.get());


// Creating a cursor on the palette's third color
var thirdColorCursor = tree.select('palette', 'colors', 2);
console.log(thirdColorCursor.get());


// Note that you can also perform subselections if needed
var colorCursor = paletteCursor.select('colors');
console.log(colorCursor.get());

var initialState = tree.get();
tree.set('hello', 'monde');

console.log(tree.get());