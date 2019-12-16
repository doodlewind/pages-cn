var RENDER = function(ctx) {
    var WIDTH = 500;
    var HEIGHT = 200;
    if (window.innerWidth < 900)
        var SIZE = 32;
    else SIZE = 64;

    try {
        var stream = getInput();
        parse(stream);
        var output = traversal(AST, X_BASE, Y_BASE, SIZE);
        output = middle(output);
        show(output);

    } catch (e) {
        log(e);

    } finally {
        // reset global variables
        STACK = [[0, ""]];
        SYMBOLS = [];
        NODES = [];
        AST = {};
        OUTPUT = "";
        X_BASE = 0;
        Y_BASE = 100;
    }

    function getInput() {
        var INPUT = document.getElementById("input").value;
        var STREAM = LEXER(INPUT);
        return STREAM;
    }
    function parse(STREAM) {
        // STATE and ACTION implicitly used
        PARSE(STREAM, STACK, STATE, ACTION);
    }
    function log(message) {
        var outputBox = document.getElementById("output");
        outputBox.value = message;
    }
    function show(OUTPUT) {
        ctx.canvas.width = WIDTH;
        ctx.canvas.height = HEIGHT;

        var lines = OUTPUT.split("\n");
        var outputBox = document.getElementById("output");
        outputBox.value = OUTPUT;

        for (var i = 0; i < lines.length; i++) {
            var line = lines[i].split(',');
            ctx.font= line[2] + "px Courier New";

            var symbol = line[3];
            ctx.fillText(symbol, line[0], HEIGHT-line[1]);
        }
    }
    function middle(OUTPUT) {
        if (!OUTPUT) {

        }
        var lines = OUTPUT.split('\n');
        var lastLine = lines[lines.length - 2].split(',');
        // index of last line is length - 2 due to an extra \n
        var endX = parseFloat(lastLine[0]) + parseFloat(lastLine[2]) * lastLine[3].length;

        if (endX < WIDTH * 2) {
            var offset = WIDTH / 2 - endX / 2;
            // console.log(endX);
            // console.log(offset);
            OUTPUT = "";
            for (var i = 0; i < lines.length - 1; i++) {
                var line = lines[i].split(',');
                line[0] = parseFloat(line[0]) + offset;
                OUTPUT += line.join(',') + "\n";
            }
        }
        else {
            throw "too long!";
        }
        return OUTPUT;
    }
};
