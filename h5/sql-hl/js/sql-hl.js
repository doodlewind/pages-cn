var LEXER = (function() {
    var lexer = {};

    var COLOR_1 = "#70CDFF";
    var COLOR_2 = "#9DFCF8";
    var COLOR_3 = "#94F2D4";
    var COLOR_4 = "#A5E8B7";
    var COLOR_5 = "lightgray";
    var WHITE = "white";
    var text = "";
    var lexOut;

    lexer.read = function(str) {
        lexOut = "";
        text = str;
        parse();
        return lexOut;
    };

    function parse() {
        function nextToken() {
            var space = text.match(/^\s/);
            if (space != null ) return forward(space, WHITE);

            var key = text.match(/^(USE |SELECT|INSERT|INTO|FROM|WHERE|VALUES|JOIN|HAVING|GROUP BY| AND |ORDER BY|OR |CREATE|TRUNCATE|DROP)/i);
            if (key != null ) return forward(key, COLOR_1);

            var field = text.match(/^'[^']*'/);
            if (field != null ) return forward(field, COLOR_2);

            var token = text.match(/^[\S]+/);
            if (token != null ) return forward(token, COLOR_5);

            var enter = text.match(/^\n/);
            if (enter != null ) return forward(enter, WHITE);

            function forward(symbol, color) {
                text = text.substr(symbol[0].length, text.length);

                if (symbol[0] == '\n') {
                    return "<br>";
                } else {
                    return "<span style='color:" + color + "'>" + symbol[0] + "</span>";
                }
            }
        }

        while(text.length > 0) {
            lexOut += nextToken();
        }
    }

    return lexer;
})();
