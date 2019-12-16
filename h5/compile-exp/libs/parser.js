var STACK = [[0, ""]];
var SYMBOLS = [];
var NODES = [];
var AST = {};
var OUTPUT = "";
var X_BASE = 0;
var Y_BASE = 100;
var SIZE = 64;

var PARSE = function(STREAM, STACK, STATE, ACTION) {
    var i = 0;
    while (true) {
        if (i > STREAM.length - 1) {
            throw "Parsing Outbound!";
        }

        var symbol = STREAM[i];
        var a = symbol.token;

        // STACK[top] is in format [2, 'abc']
        var s = STACK.top(0)[0];

        // ACTION[0][symbol] is in format ['s', 1]
        if (ACTION[s][a] !== undefined) {
            var act = ACTION[s][a][0];
        }
        else {
            if (a === '\n')
                a = 'End Symbol($$)';
            throw "Parse Error on " + a;
        }

        var index = ACTION[s][a][1];

        if (act === 's') {
            var item = [index, symbol.value];
            STACK.push(item);
            i++;
        }
        else if (act === 'r') {
            var beta = GRAMMAR[index]['to'].length;
            var A = GRAMMAR[index]['from'].str;

            //printReduction(GRAMMAR[index]);
            GRAMMAR[index]['action']();

            // pop chars according to value of beta
            STACK.splice(-1 * beta, beta);
            var t = STACK.top(0)[0];

            item = [ACTION[t][A][1], symbol.value];
            //STACK.push(ACTION[t][A][1]);
            STACK.push(item);
        }
        else if (act === 'ACC') {
            GRAMMAR[index]['action']();
            break;
        }
        else {
            throw "Except $$ on end!";
        }
    }
};
