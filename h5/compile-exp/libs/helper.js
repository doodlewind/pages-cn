// global helper functions
Array.prototype.top = function(i) {
    if (i < 0) i = -i;
    return this[this.length - 1 - i];
};
var newLine = function(x, y, size, val) {
    return [fix(x), fix(y), fix(size), val].join(',') + '\n';

    function fix(x) {
        return Math.round (x * 1000) / 1000;
    }
};
var printReduction = function (production) {
    var tmp = "";
    tmp += production['from'].str + " ->";

    for (var i = 0; i < production['to'].length; i++) {
        tmp += " " + production['to'][i].str;
    }
    console.log(tmp);
};
var newNode = function (str, value, index) {
    var node = {};
    node.str= str;
    node.value = value;
    node.index = index;
    node.children = [];
    return node;
};
var addChild = function (parent, child) {
    parent.children.push(child);
};
