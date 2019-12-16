define([], function(){
    var rom = {
        data: [],
        sizePRG: 0,
        /**
         * read bytes from address
         * example: read(0x00, 8, 8, 16)
         */
        read: function () {
            var base = arguments[0];
            var result = [];
            // read(0x00) returns an array with one byte by default
            if (arguments.length == 1) {
                return [this.data[base]];
            }

            for (var i = 1; i < arguments.length; i++) {
                switch (arguments[i]) {
                    case 8:
                        result.push(this.data[base + i - 1]);
                        break;
                    case 16:
                        var little = this.data[base + i - 1];
                        var high = this.data[base + i];
                        result.push(high * 256 + little);
                }
            }
            return result;
        }
    };
    var load = function(filename, callback) {
        var req = new XMLHttpRequest();
        req.open("get", filename, true);
        req.responseType = "arraybuffer";
        req.onload = function() {
            var buffer = this.response;
            rom.data = new Uint8Array(buffer);
            rom.sizePRG = rom.data[4] * 16384;
            // return rom in callback
            callback(rom);
        };
        req.send();
    };
    return {
        load: load
    }
});