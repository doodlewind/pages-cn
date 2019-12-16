/**
 * log with multi arguments and hex convert
 */
function log() {
    var msg = "";
    for (var i = 0; i < arguments.length; i++)
        msg += arguments[i].toString(16).toUpperCase();
    console.log(msg);
}

require.config({
    paths: {
        reader: 'lib/rom-reader',
        disassembler: 'lib/rom-disassembler'
    }
});

require(['reader', 'disassembler'], function (reader, disassembler) {
    var btn = document.getElementById("btn");
    btn.onclick = function() {
        var index = parseInt(document.getElementById("input").value, 16);
        reader.load('roms/super-mario-bros.nes', function(rom) {
            if (index >= 0)
                disassembler.fetch(rom, index + 0x10);
            else
                disassembler.disassemble(rom);
            alert("Disassemble complete.\nYou can find result in console.")
        });
    }
});