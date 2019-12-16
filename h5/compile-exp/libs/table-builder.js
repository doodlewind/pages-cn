var BUILD = function (S, GRAMMAR) {
    // helper functions
    var uniqueBy = function (a, key) {
        var seen = {};
        return a.filter(function (item) {
            var k = key(item);
            return seen.hasOwnProperty(k) ? false : (seen[k] = true);
        });
    };
    var clone = function (obj) {
        var newObj = obj.constructor === Array ? [] : {};
        if (typeof obj !== 'object') {
            return;
        } else {
            for (var i in obj) {
                newObj[i] = typeof obj[i] === 'object' ?
                    clone(obj[i]) : obj[i];
            }
        }
        return newObj;
    };
    var hasValue = function (arr, obj) {
        return (arr.indexOf(obj) != -1);
    };
    var printState = function (state) {
        for (var i in state) {
            var tmp = "";
            for (var s in state[i]) {
                tmp += " " + state[i][s].str;
            }
            console.log(tmp);
        }
    };
    var printAction = function () {
        console.log("\n\nACTION Table:");
        for (var i = 0; i < ACTION.length; i++) {
            var tmp = "| ";
            for (var j in ACTION[i]){
                tmp = tmp + j + " " + ACTION[i][j][0] + ACTION[i][j][1] + " | ";
            }
            console.log(tmp);
        }
    };

    // add special symbols to S
    S['ACC'] = {'type': 'ACC'};
    S['●'] = {'type': '●'};
    S['\n'] = {'type': '\n'};
    for (var s in S) {
        S[s]['str'] = s;
    }

    var AUGMENT = [[GRAMMAR[0]['from']].concat([S['●']]).concat(GRAMMAR[0]['to'])];
    var FIRST = {};
    var FOLLOW = {};
    var STATE = [];
    var ACTION = [];
    //console.log(AUGMENT);
    var buildClosure = (function () {
        function closure(items) {
            var J = clone(items);
            // J: [
            //     [{str: 'E', type: 'NonTerminal'}, {str: '●', type: '●'}...]
            // ]
            //console.log(items);

            while (true) {
                var before = J.length;

                for (var i = 0; i < J.length; i++) {
                    derive(J[i]);
                }
                var after = J.length;
                if (before == after) {
                    break;
                }
            }

            return J;

            // find all productions derived from input production
            function derive(item) {
                for (var i = 0; i < item.length; i++) {
                    // symbol = E, A, + ...
                    var symbol = item[i];
                    if (symbol.type === '●') {
                        if (i + 1 in item) {
                            //console.log(item[i+1].str);
                            findStartWith(item[i + 1]);
                        }
                    }
                }
            }

            // find all productions in grammar begins with input symbol
            function findStartWith(symbol) {
                for (var i = 0; i < GRAMMAR.length; i++) {
                    if (GRAMMAR[i]['from'].str === symbol.str) {
                        testIn(GRAMMAR[i]);
                    }
                }
            }

            // test if production already in J, and add to J if not
            function testIn(production) {
                var diff = [];

                // loop over J
                for (var i = 0; i < J.length; i++) {
                    var tmpItem = [];
                    // start from item[1], skip first symbol
                    for (var j = 1; j < J[i].length; j++) {
                        var symbol = J[i][j];
                        if (symbol.type !== '●') {
                            tmpItem.push(symbol);
                        }
                    } // tmpItem is one item in J
                    if (tmpItem.length == production['to'].length) {
                        for (var k = 0; k < tmpItem.length; k++) {
                            // bug fixed, if dot is not at first place, items can't be same
                            if (J[i][1].type !== '●') {
                                diff.push(false); break;
                            }
                            // bug fixed, not comparing type, but str
                            if (tmpItem[k].str === production['to'][k].str) {
                                continue;
                            }
                            diff.push(false); break; // bug fixed, adding break
                        }
                    } else {
                        diff.push(false);
                    }
                }
                // if production is different from all items in J
                if (diff.length == J.length) {
                    add(production);
                }

                // add production into J
                function add(production) {
                    var tmpProduction = [production['from'], S['●']];
                    for (var i = 0; i < production['to'].length; i++) {
                        tmpProduction.push(production['to'][i]);
                    }
                    J.push(tmpProduction);
                }
            }

        }
        return closure;
    })();

    function buildFirstTable() {
        initFirst();
        while (true) {
            var changed = false;
            for (var s in S) {
                // avoid adding end symbol into FIRST table
                if (s !== '\n' && buildFirst(S[s])) {
                    changed = true;
                }
            }
            //console.log("\n");
            if (changed == false) break;
        }

        // input an symbol S['X']
        // modify its FIRST set according to current FIRST table
        function buildFirst(symbol) {
            var changed = false;

            // FIRST of terminal is itself
            if (isTerminal(symbol)) {
                //console.log("change symbol is Terminal");
                if (!hasValue(FIRST[symbol.str], symbol)) {
                    changed = true;
                    FIRST[symbol.str] = [symbol];
                }
            }
            // to Non-Terminal, apply rules
            else {
                for (var i in GRAMMAR) {
                    if (GRAMMAR[i]['from'] == symbol) {
                        // X → A B C...
                        if (GRAMMAR[i]['to'] !== '') {
                            var item = GRAMMAR[i];

                            // for all symbols in A → B C D E
                            for (var j = 0; j < item['to'].length; j++) {

                                var s = item['to'][j];
                                // S[''] stands for epsilon
                                if (!hasValue(FIRST[s.str], S[''])) {
                                    break;
                                }
                            }
                            // each of item[0] to item[j] has ɛ in FIRST
                            // their FIRST symbol should be added
                            if (j == 0) {
                                addToFirst(item['to'][0].str, symbol.str);
                            }
                            else {
                                for (var k = 0; k < j; k++) {
                                    addToFirst(item['to'][k].str, symbol.str);
                                }
                            }

                        } else {
                            // X → ɛ
                            // add in epsilon
                            // console.log("change X to epsilon");
                            if (!hasValue(FIRST[symbol.str])) {
                                changed = true;
                                FIRST[symbol.str].push(S['']);
                            }
                        }
                    }
                }
            }
            return changed;

            // dest and src are in 'X' format (not S['X'])
            function addToFirst(src, dest) {
                for (var i = 0; i < FIRST[src].length; i++) {
                    if (!hasValue(FIRST[dest], FIRST[src][i])) {
                        changed = true;
                        //console.log("change: addIntoFIRST");
                        FIRST[dest].push(FIRST[src][i]);
                    }
                }
            }

            function isTerminal(symbol) {
                return symbol.type === 'Terminal';
            }
        }

        function initFirst() {
            for (var i in S) {
                if (S[i].type === 'Terminal' || S[i].type === 'NonTerminal' && S[i].str !== '\n') {
                    FIRST[S[i].str] = [];
                }
            }
        }
    }

    function buildFollowTable() {
        initFollow();
        while (true) {
            var changed = false;
            for (var s in S) {
                // avoid adding Terminal into FOLLOW table
                if (S[s].type === 'NonTerminal' && buildFollow(S[s])) {
                    changed = true;
                }
            }
            if (changed === false) break;
        }
        // input a symbol like S['X']
        function buildFollow() {
            var changed = false;
            // for all NonTerminal, add $ to its FOLLOW
            if (!hasValue(FOLLOW[GRAMMAR[0]['from'].str], S['\n'])) {
                changed = true;
                FOLLOW[GRAMMAR[0]['from'].str].push(S['\n']);
            }

            for (var i in GRAMMAR) {
                var rule = GRAMMAR[i]['to'];
                var j = rule.length - 1;

                // if A → α...B
                // add FOLLOW(A) to FOLLOW(B)
                if (rule[j].type === 'NonTerminal') {
                    addFollowToFollow(GRAMMAR[i]['from'].str, rule[rule.length - 1].str);
                }

                // if A → B C D E F, then FOLLOW(E)←FIRST(F), FOLLOW(D)←FIRST(E)...
                for (; j > 0; j--) {
                    if (rule[j - 1].type === 'NonTerminal') {
                        addFirstToFollow(rule[j].str, rule[j - 1].str);
                    }
                }
                //addFirstToFollow(rule[0].str, GRAMMAR[i]['from'].str);
            }

            // if A → B C D E F G and D E F G have epsilon in their FIRST
            // add FOLLOW(A) to FOLLOW(C D E F G)
            for (var k in GRAMMAR) {
                rule = GRAMMAR[k]['to'];
                for (j = rule.length - 1; j > 0; j--) {
                    if (!hasValue(FIRST[rule[j].str], S[''])) break;
                }
                //console.log("Test: " + GRAMMAR[k]['from'].str + " to " + GRAMMAR[k]['to'][j].str);
                // BUG HERE! For {E → T E_} no adding E to T performed!
                for (; j < rule.length; j++) {
                    if (rule[j].type === 'NonTerminal') {
                        //console.log(GRAMMAR[k]['from'].str + ", " + rule[j].str + " added\n");
                        addFollowToFollow(GRAMMAR[k]['from'].str, rule[j].str);
                    }
                }
            }

            return changed;

            // src and dest are in 'X' format, not S['X']
            function addFirstToFollow(src, dest) {
                for (var i = 0; i < FIRST[src].length; i++) {
                    if (!hasValue(FOLLOW[dest], FIRST[src][i]) && FIRST[src][i] !== S['']) {
                        changed = true;
                        //console.log("change: addFirstToFollow");
                        FOLLOW[dest].push(FIRST[src][i]);
                    }
                }
            }

            // src and dest are in 'X' format, not S['X']
            function addFollowToFollow(src, dest) {
                for (var i = 0; i < FOLLOW[src].length; i++) {
                    if (!hasValue(FOLLOW[dest], FOLLOW[src][i]) && FOLLOW[src][i] !== S['']) {
                        changed = true;
                        //console.log("change: addFollowToFollow");
                        FOLLOW[dest].push(FOLLOW[src][i]);
                    }
                }
            }
        }

        function initFollow() {
            for (var i in S) {
                if (S[i].type === 'NonTerminal') {
                    FOLLOW[S[i].str] = [];
                }
            }
        }
    }

    function buildStateTable() {
        STATE[0] = buildClosure(AUGMENT);

        while (true) {
            // removing while loop does not affect STATE result
            var changed = false;
            for (var i = 0; i < STATE.length; i++) {
                var state = STATE[i];
                var shiftSymbols = shiftOf(state);

                for (var j = 0; j < shiftSymbols.length; j++) {
                    var symbol = shiftSymbols[j];
                    if (addState(state, symbol)) {
                        changed = true;
                    }
                }
            }
            if (changed == false) {
                break;
            }
        }
        // for every item in state, find possible transition symbols
        function shiftOf(state) {
            var shiftTo = [];
            for (var i = 0; i < state.length; i++) {
                var item = state[i];
                for (var j = 0; j < item.length; j++) {
                    if (item[j].type === '●') {
                        // do not add symbol if production ended
                        if (j + 1 in item) {
                            shiftTo.push(item[j + 1]);
                        }
                    }
                }
            }
            shiftTo = uniqueBy(shiftTo, JSON.stringify);
            // according to shiftTo list, add new state into STATE
            return shiftTo;
        }

        function addState(state, symbol) {
            var newState = [];
            // swap dot to BUILD new state
            for (var i = 0; i < state.length; i++) {
                var item = state[i];
                for (var j = 0; j < item.length; j++) {
                    if (item[j].type === '●') {
                        // only add item that matches symbol
                        if (j + 1 in item && item[j + 1].str === symbol.str) {
                            var newItem = clone(item);

                            // swap Dot with its following symbol
                            var tmp = newItem[j];
                            newItem[j] = newItem[j + 1];
                            newItem[j + 1] = tmp;
                            newState.push(newItem);
                        }
                    }
                }
            }
            newState = buildClosure(newState);
            var before = STATE.length;
            STATE.push(newState);
            STATE = uniqueBy(STATE, JSON.stringify);
            return !(STATE.length == before);
        }
    }

    function buildActionTable() {
        for (var i = 0; i < STATE.length; i++) {
            var state = STATE[i];
            ACTION[i] = {};
            var itemsWithSameSymbol = {};

            // group items by their symbol following dot
            for (var j = 0; j < state.length; j++) {
                var item = state[j];
                // test and apply possible reduction
                var dotNext = findDotAndReduce(item, i);
                if (dotNext !== -1) {
                    if (itemsWithSameSymbol[item[dotNext].str] === undefined) {
                        itemsWithSameSymbol[item[dotNext].str] = [];
                    }
                    itemsWithSameSymbol[item[dotNext].str].push(item);
                }
            }

            for (j in itemsWithSameSymbol) {
                var tmp = [];
                for (var k in itemsWithSameSymbol[j]) {
                    item = itemsWithSameSymbol[j][k];
                    dotNext = findDotNext(item);
                    var tmpItem = swapDot(item, dotNext);
                    if (searchShift(tmpItem, i).length > 0) {
                        tmp.push(searchShift(tmpItem, i));
                    }
                }

                var searchIndex = findShiftIndex(tmp);
                if (tmp.length > 0) {
                    searchIndex = findShiftIndex(tmp);
                    if (ACTION[i][j] === undefined) {
                        ACTION[i][j] = ['s', searchIndex];
                    }
                }
            }
        }

        // BUILD accept symbol in format ['ACC', 0]
        var acc = [GRAMMAR[0]['from']].concat(GRAMMAR[0]['to']).concat([S['●']]);

        for (i = 0; i < STATE.length; i++) {
            state = STATE[i];
            for (j = 0; j < state.length; j++) {
                item = state[j];
                if (findAccept(i, item)) break;
            }
        }

        function findAccept(index, item) {
            if (item.length == acc.length) {
                for (k = 0; k < item.length; k++) {
                    if (!(item[k].str === acc[k].str)) break;
                }
                if (k == item.length) {
                    //console.log(index);
                    ACTION[index]['\n'] = ['ACC', 0];
                    return true;
                }
            }
            return false;
        }

        function findDotNext(item) {
            for (var i = 0; i < item.length; i++) {
                if (item[i].str === '●') {
                    if (i == item.length - 1) {
                        return -1;
                    }
                    else {
                        return i + 1;
                    }
                }
            }
        }

        function swapDot(item, i) {
            var tmpItem = clone(item);
            var tmp = tmpItem[i];
            tmpItem[i] = tmpItem[i - 1];
            tmpItem[i - 1] = tmp;
            return tmpItem;
        }

        // find index of item following dot, then apply possible reduction
        function findDotAndReduce(item, stateIndex) {
            for (var i = 0; i < item.length; i++) {
                // if dot at end of production, apply reduction
                if (item[i].str === '●') {
                    if (i == item.length - 1) {
                        var firstSymbol = item[0].str;
                        for (var j in FOLLOW[firstSymbol]) {
                            // Add reduction rules
                            reduceRule(stateIndex, FOLLOW[firstSymbol][j]);
                        }
                        return -1;
                    }
                    else {
                        return i + 1;
                    }
                }
            }
            function reduceRule(index, symbol) {
                var state = STATE[index];
                for (var i = 0; i < state.length; i++) {
                    var item = state[i];
                    if (item[item.length - 1].str === '●') {
                        ACTION[index][symbol.str] = findItemInGrammar(item);
                    }
                }

                function findItemInGrammar(item) {
                    for (var i = 0; i < GRAMMAR.length; i++) {
                        var g = GRAMMAR[i];
                        if (g['from'].str == item[0].str && g['to'].length == item.length - 2) {
                            for (var j = 0; j < item.length - 2; j++) {
                                if (g['to'][j].str !== item[j + 1].str) {
                                    break;
                                }
                            }
                            if (j == item.length - 2) {
                                return ['r', i];
                            }
                        }
                    }
                    return -1;
                }
            }
        }

        // input an item, return list of all occurrence in STATE
        function searchShift(item) {
            var tmpItem = clone(item);
            var results = [];
            for (var i = 0; i < STATE.length; i++) {
                for (var j = 0; j < STATE[i].length; j++) {
                    var stateItem = STATE[i][j];

                    if (tmpItem.length == stateItem.length) {
                        for (var k = 0; k < tmpItem.length; k++) {
                            if (tmpItem[k].str !== stateItem[k].str) break;
                        }
                        if (k == tmpItem.length) {
                            results.push(i);
                        }
                    }
                }
            }
            return results;
        }

        // input [ [1, 2, 3], [1, 5, 8], [1, 2, 4] ], find unique 1
        function findShiftIndex(indexs) {
            if (indexs.length == 0) {
                return -1;
            }
            if (indexs.length == 1) {
                return indexs[0][0];
            }
            var firstGroup = indexs[0];
            for (var i = 0; i < firstGroup.length; i++) {
                for (var j = 1; j < indexs.length; j++) {
                    if (!hasValue(indexs[j], firstGroup[i])) {
                        break;
                    }
                }
                if (j == indexs.length) {
                    return firstGroup[i];
                }
            }
        }
    }

    buildFirstTable();

    buildFollowTable();

    buildStateTable();

    buildActionTable();


    return [STATE, ACTION];
};

// build table for once
var TMP = BUILD(S, GRAMMAR);
var STATE = TMP[0];
var ACTION = TMP[1];