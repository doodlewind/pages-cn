// execute semantic action
function traversal(node, x, y, size) {
    //console.log(node);
    return GRAMMAR[node.index]['calc'](node, x, y, size);
}