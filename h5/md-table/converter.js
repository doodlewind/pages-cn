window.onload = function () {
    /* Global Variables */
    var line, tr, start, end, lookahead, grid;
    /* ---------- */

    init();
    function init() {
        document.getElementById("table2md").addEventListener('click', copy, false);
        document.getElementById("row-a").addEventListener('click', addRow, false);
        document.getElementById("row-d").addEventListener('click', delRow, false);
        document.getElementById("col-a").addEventListener('click', addCol, false);
        document.getElementById("col-d").addEventListener('click', delCol, false);
        document.getElementById("markdown").addEventListener('input', parse, false);
        document.getElementById("grid").addEventListener('input', outMD, false);

        function addRow() {
            var grid = document.getElementById("grid");
            var colCount;
            if (grid.children[0] !== undefined) {
                colCount = grid.children[0].children.length;
            }
            else {
                colCount = 4;
            }
            var tr = document.createElement("tr");
            for (var i = 0; i < colCount; i++) {
                var td = document.createElement("td");
                var input = document.createElement("input");
                td.appendChild(input);
                tr.appendChild(td);
            }
            grid.appendChild(tr);
            outMD();
        }

        function delRow() {
            var grid = document.getElementById("grid");
            if (grid.children[0] !== undefined  && grid.children.length > 1) {
                var lastRow = grid.children[grid.children.length - 1];
                grid.removeChild(lastRow);
            }
            outMD();
        }

        function addCol() {
            var grid = document.getElementById("grid");
            if (grid.children[0] !== undefined) {
                var rowCount = grid.children.length;
                for (var i = 0; i < rowCount; i++) {
                    var td =  document.createElement("td");
                    var input = document.createElement("input");
                    td.appendChild(input);
                    grid.children[i].appendChild(td);
                }
            }
            outMD();
        }

        function delCol() {
            var grid = document.getElementById("grid");
            if (grid.children[0] !== undefined && grid.children[0].children.length > 1) {
                var rowCount = grid.children.length;
                for (var i = 0; i < rowCount; i++) {
                    var row = grid.children[i];
                    var lastCount = row.children.length - 1;
                    var lastCol = row.children[lastCount];
                    row.removeChild(lastCol);
                }
            }
            outMD();
        }

        function copy() {
            outMD();
            var text = document.getElementById("markdown").value;
            window.prompt("Press ⌘/Ctrl - C to copy.", text);
        }

        function outMD() {
            var grid = document.getElementById("grid");

            if (grid.children[0] != undefined) {
                var rowCount = grid.children.length;
                var colCount = grid.children[0].children.length;
                var tmp = [];
                var t;

                for (var j = 0; j < colCount; j++) {
                    tmp[j] = [];
                    for (var i = 0; i < rowCount; i++) {
                        t = grid.children[i].children[j].children[0].value;
                        t = t.replace(/^( )+/, '');
                        t = t.replace(/( )+$/, '');
                        // wash out blanks
                        grid.children[i].children[j].children[0].value = t;
                        if (t != undefined) {
                            tmp[j][i] = t.length;
                        }
                        else tmp[j][i] = 0;
                    }
                }

                var out = document.getElementById("markdown");
                out.value = "";

                for (var i = 0; i < rowCount; i++) {
                    out.value += "|";
                    for (var j = 0; j < colCount; j++) {
                        var maxLen = tmp[j].max();
                        var nodeVal = grid.children[i].children[j].children[0].value;
                        out.value += ' ' + nodeVal;
                        for (var k = 0; k <= maxLen - nodeVal.length; k++) {
                            out.value += ' ';
                        }
                        out.value += '|';
                    }
                    if (i < rowCount - 1) {
                        out.value += '\n';
                    }

                    if (i == 0 && rowCount > 1) {
                        for (var j = 0; j < colCount; j++) {
                            out.value += '|';
                            for (var k = 0; k <= tmp[j].max() + 1; k++)
                            out.value += '-';
                        }
                        out.value += '|\n';
                    }
                }

            }
        }
    }

    String.prototype.insert = function (index, string) {
        if (index > 0)
            return this.substring(0, index) + string + this.substring(index, this.length);
        else
            return string + this;
    };

    Array.prototype.max = function() {
        return Math.max.apply(null, this);
    };

    /* Parse markdown table using recursive descent method. */
    function parse() {
        grid = document.getElementById("grid");
        var source = document.getElementById("markdown").value.split('\n');
        grid.innerHTML = "";

        for (var k = 0; k < source.length; k++) {
            if (k == 1) continue;
            tr = document.createElement("tr");
            tr.id = "r-" + k;

            start = -1;
            end = -1;
            line = source[k];

            lookahead = nextSymbol();

            if (line[0] != '|') {
                line = line.insert(0, '| ');
            }
            if (line[line.length - 1] == '|') {
                line = line.substr(0, line.length - 1);
            }
            cell();

           grid.appendChild(tr);

        }
    }


    function cell() {
        match();
        text();
        if (end >= line.length) {
            return;
        }
        cell();
    }

    function text() {
        var td = document.createElement("td");
        var input = document.createElement("input");

        var nodeVal = line.slice(start, end);
        nodeVal = nodeVal.replace(/^( )+/, '');
        nodeVal = nodeVal.replace(/( )+$/, '');
        input.value = nodeVal;

        td.appendChild(input);
        tr.appendChild(td);

        match();
    }

    function match() {
        lookahead = nextSymbol();
    }

    function nextSymbol() {
        start = ++end;
        if (line[start] == '|') {
            end = start;
            return line[start];
        }

        // let end be end of cell text
        for (end; line[end+1] != '|'; end++) {
            if (end >= line.length) return;
        }
        return line.slice(start, end);
    }

    function error() {
        alert("ERROR!");
    }
};