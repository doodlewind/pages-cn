var S = {
    'S': { type: 'NonTerminal' },
    'B': { type: 'NonTerminal' },
    'T': { type: 'NonTerminal' },
    'R': { type: 'NonTerminal' },
    'SUM': { type: 'NonTerminal' },
    'INT': { type: 'NonTerminal' },
    '{': { type: 'Terminal' },
    '}': { type: 'Terminal' },
    '(': { type: 'Terminal' },
    ')': { type: 'Terminal' },
    '_': { type: 'Terminal' },
    '^': { type: 'Terminal' },
    'id': { type: 'Terminal' },
    'num': { type: 'Terminal' },
    'sum': { type: 'Terminal' },
    'int': { type: 'Terminal' },
    'opr': { type: 'Terminal' },
    'blank': { type: 'Terminal' },
    '$$': { type: 'Terminal' }
};

var gS2B = {
    'from': S['S'], 'to': [S['$$'],  S['B'], S['$$']],
    'action': function () {
        var bNode = NODES.pop();
        var sNode = newNode('S', '', GRAMMAR.indexOf(gS2B));
        addChild(sNode, bNode);

        AST = sNode;
    },
    'calc': function(node, x, y, size) {
        var childB = node.children[0];
        traversal(childB, x, y, size);
        return OUTPUT;
    }
};
var gB2TB = {
    'from': S['B'], 'to': [S['T'], S['B']],
    'action': function () {
        var bNode1 = NODES.pop();
        var tNode = NODES.pop();

        var bNode = newNode('B', '', GRAMMAR.indexOf(gB2TB));
        addChild(bNode, tNode);
        addChild(bNode, bNode1);

        NODES.push(bNode);
    },
    'calc': function(node, x, y, size) {
        var childT = node.children[0];
        var args = traversal(childT, x, y, size);

        var childB = node.children[1];
        args = traversal(childB, args['x'], y, size);
        return args;
    }
};
var gB2T = {
    'from': S['B'], 'to': [S['T']],
    'action': function () {
        var tNode = NODES.pop();
        var bNode = newNode('B', '', GRAMMAR.indexOf(gB2T));
        addChild(bNode, tNode);

        NODES.push(bNode);
    },
    'calc': function(node, x, y, size) {
        var childT = node.children[0];
        return traversal(childT, x, y, size);
    }
};
var gT2RSupBSubB = {
    'from': S['T'], 'to': [S['R'], S['_'], S['^'], S['{'], S['B'], S['}'], S['{'], S['B'], S['}']],
    'action': function () {
        var bNode2 = NODES.pop();
        var bNode1 = NODES.pop();
        var rNode = NODES.pop();
        var tNode = newNode('T', '', GRAMMAR.indexOf(gT2RSupBSubB));
        addChild(tNode, rNode);
        addChild(tNode, bNode1);
        addChild(tNode, bNode2);

        NODES.push(tNode);
    },
    'calc': function(node, x, y, size) {
        var childR = node.children[0];
        var args = traversal(childR, x, y, size);

        // handle sup arguments
        var supY = y + size * 3 / 5;
        var supSize = size * 2 / 3;
        var childB1 = node.children[1];
        var argsSup = traversal(childB1, args['x'], supY, supSize);

        // handle sub arguments
        var subY = y - size * 2 / 5;
        var subSize = size * 2 / 3;
        var childB2 = node.children[2];
        var argsSub = traversal(childB2, args['x'], subY, subSize);

        return {
            'x': Math.max(argsSup['x'], argsSub['x']),
            'y': y,
            'size': size
        }
    }
};
var gT2SumSupBSubBB = {
    'from': S['T'], 'to': [S['SUM'], S['_'], S['^'], S['{'], S['B'], S['}'], S['{'], S['B'], S['}'], S['{'], S['B'], S['}']],
    'action': function () {
        var bNode3 = NODES.pop();
        var bNode2 = NODES.pop();
        var bNode1 = NODES.pop();
        var rNode = NODES.pop();
        var tNode = newNode('T', '', GRAMMAR.indexOf(gT2SumSupBSubBB));
        addChild(tNode, rNode);
        addChild(tNode, bNode1);
        addChild(tNode, bNode2);
        addChild(tNode, bNode3);

        NODES.push(tNode);
    },
    'calc': function(node, x, y, size) {
        var childR = node.children[0];
        var args = traversal(childR, x, y, size);

        var supX = x;
        var supY = y + size * 4 / 5;
        var supSize = size / 3;
        var childB1 = node.children[1];
        var argsSup = traversal(childB1, supX, supY, supSize);

        var subX = x;
        var subY = y - size / 2;
        var subSize = size / 3;
        var childB2 = node.children[2];
        var argsSub = traversal(childB2, subX, subY, subSize);

        var followX = args['x'] + size / 3;
        var childB3 = node.children[3];

        var argsFollow = traversal(childB3, followX, y, size * 2 / 3);

        return {
            'x': argsFollow['x'],
            'y': y,
            'size': size
        }
    }
};
var gT2IntSupBSubBB = {
    'from': S['T'], 'to': [S['INT'], S['_'], S['^'], S['{'], S['B'], S['}'], S['{'], S['B'], S['}'], S['{'], S['B'], S['}']],
    'action': function () {
        var bNode3 = NODES.pop();
        var bNode2 = NODES.pop();
        var bNode1 = NODES.pop();
        var rNode = NODES.pop();
        var tNode = newNode('T', '', GRAMMAR.indexOf(gT2IntSupBSubBB));
        addChild(tNode, rNode);
        addChild(tNode, bNode1);
        addChild(tNode, bNode2);
        addChild(tNode, bNode3);

        NODES.push(tNode);
    },
    'calc': function(node, x, y, size) {
        var childR = node.children[0];
        var args = traversal(childR, x, y, size);

        var supY = y + size * 3 / 5;
        var supSize = size / 2;
        var childB1 = node.children[1];
        var argsSup = traversal(childB1, args['x'], supY, supSize);

        var subY = y - size * 2 / 5;
        var subSize = size / 2;
        var childB2 = node.children[2];
        var argsSub = traversal(childB2, args['x'], subY, subSize);

        var followX = Math.max(args['x'], argsSup['x'], argsSub['x']);
        var childB3 = node.children[3];
        var argsFollow = traversal(childB3, followX, y, size * 2 / 3);

        return {
            'x': argsFollow['x'],
            'y': y,
            'size': size
        }
    }
};
var gT2RSupB = {
    'from': S['T'], 'to': [S['R'], S['^'], S['{'], S['B'], S['}']],
    'action': function () {
        var bNode = NODES.pop();
        var rNode = NODES.pop();
        var tNode = newNode('T', '', GRAMMAR.indexOf(gT2RSupB));
        addChild(tNode, rNode);
        addChild(tNode, bNode);

        NODES.push(tNode);
    },
    'calc': function(node, x, y, size) {
        var childR = node.children[0];
        var args = traversal(childR, x, y, size);

        // handle sup arguments
        args['y'] = y + size * 3 / 5;
        args['size'] = size * 2 / 3;;
        var childB = node.children[1];
        return traversal(childB, args['x'], args['y'], args['size']);
    }
};
var gT2RSubB = {
    'from': S['T'], 'to': [S['R'], S['_'], S['{'], S['B'], S['}']],
    'action': function () {
        var bNode = NODES.pop();
        var rNode = NODES.pop();
        var tNode = newNode('T', '', GRAMMAR.indexOf(gT2RSubB));
        addChild(tNode, rNode);
        addChild(tNode, bNode);

        NODES.push(tNode);
    },
    'calc': function(node, x, y, size) {
        var childR = node.children[0];
        var args = traversal(childR, x, y, size);

        // handel sub arguments
        args['y'] = y - size * 2 / 5;
        args['size'] = size * 2 / 3;
        var childB = node.children[1];
        return traversal(childB, args['x'], args['y'], args['size']);
    }
};
var gT2R = {
    'from': S['T'], 'to': [S['R']],
    'action': function () {
        var rNode = NODES.pop();
        var tNode = newNode('T', '', GRAMMAR.indexOf(gT2R));
        addChild(tNode, rNode);

        NODES.push(tNode);
    },
    'calc': function(node, x, y, size) {
        var childR = node.children[0];
        return traversal(childR, x, y, size);
    }
};
var gR2Id = {
    'from': S['R'], 'to': [S['id']],
    'action': function () {
        var id = STACK.top(0)[1].toString();
        var rNode = newNode('R', id, GRAMMAR.indexOf(gR2Id));

        NODES.push(rNode);
    },
    'calc': function(node, x, y, size) {
        var nodeText = node.value;
        OUTPUT += newLine(x, y, size, nodeText);

        return {
            'x': x + nodeText.length * size / 1.7,
            'y': y,
            'size': size
        };
    }
};
var gR2Num = {
    'from': S['R'], 'to': [S['num']],
    'action': function () {
        var num = STACK.top(0)[1].toString();
        var rNode = newNode('R', num, GRAMMAR.indexOf(gR2Num));

        NODES.push(rNode);
    },
    'calc': function(node, x, y, size) {
        var nodeText = node.value;
        OUTPUT += newLine(x, y, size, nodeText);

        return {
            'x': x + nodeText.length * size / 1.7,
            'y': y,
            'size': size
        };
    }
};
var gR2Opr = {
    'from': S['R'], 'to': [S['opr']],
    'action': function () {
        var opr = STACK.top(0)[1].toString();
        var rNode = newNode('R', opr, GRAMMAR.indexOf(gR2Opr));
        NODES.push(rNode);
    },
    'calc': function(node, x, y, size) {
        var nodeText = node.value;
        OUTPUT += newLine(x, y, size, nodeText);

        return {
            'x': x + nodeText.length * size / 2,
            'y': y,
            'size': size
        };
    }
};
var gSum = {
    'from': S['SUM'], 'to': [S['sum']],
    'action': function () {
        var sumNode = newNode('SUM', '∑', GRAMMAR.indexOf(gSum));
        NODES.push(sumNode);
    },
    'calc': function(node, x, y, size) {
        var nodeText = node.value;
        OUTPUT += newLine(x, y, size, nodeText);

        return {
            'x': x + nodeText.length * size / 2,
            'y': y,
            'size': size
        };
    }
};
var gInt = {
    'from': S['INT'], 'to': [S['int']],
    'action': function () {
        var intNode = newNode('INT', '∫', GRAMMAR.indexOf(gInt));
        NODES.push(intNode);
    },
    'calc': function(node, x, y, size) {
        var nodeText = node.value;
        OUTPUT += newLine(x, y, size, nodeText);

        return {
            'x': x + nodeText.length * size / 2,
            'y': y,
            'size': size
        };
    }
};
var gR2Blank = {
    'from': S['R'], 'to': [S['blank']],
    'action': function () {
        var rNode = newNode('R', '', GRAMMAR.indexOf(gR2Blank));
        NODES.push(rNode);
    },
    'calc': function(node, x, y, size) {
        return {
            'x': x + size / 2,
            'y': y,
            'size': size
        };
    }
};
var gR2BracketBBracket = {
    'from': S['R'], 'to': [S['('], S['B'], S[')']],
    'action': function () {
        var bNode = NODES.pop();
        var rNode = newNode('R', '', GRAMMAR.indexOf(gR2BracketBBracket));
        addChild(rNode, bNode);

        NODES.push(rNode);
    },
    'calc': function(node, x, y, size) {
        var childB = node.children[0];

        OUTPUT += newLine(x, y, size, '(');
        var args = traversal(childB, x + size / 2, y, size);

        OUTPUT += newLine(args['x'], y, size, ')');
        return {
            'x': args['x'] + size / 2,
            'y': y,
            'size': size
        };
    }
};

var GRAMMAR = [
    gS2B,
    gB2TB,
    gB2T,
    gT2RSupBSubB,
    gT2SumSupBSubBB,
    gT2IntSupBSubBB,
    gT2RSupB,
    gT2RSubB,
    gT2R,
    gR2Id,
    gR2Num,
    gR2Opr,
    gSum,
    gInt,
    gR2Blank,
    gR2BracketBBracket
];