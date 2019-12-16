define([], function() {
    var count = {};
    /**
     * fetch code according to 6502 instruction set
     * @param rom
     * @param p
     */
    var fetch = function(rom, p) {
        //addressing modes
        var accumulator = function(name) {
            log(name, " A");
        };
        var absolute = function(name) {
            log(name, " $", rom.read(p+1, 16)[0]);
            p+=2;
        };
        var absoluteX = function(name) {
            log(name, " $", rom.read(p+1, 16)[0], ",X");
            p+=2;
        };
        var absoluteY = function(name) {
            log(name, " $", rom.read(p+1, 16)[0], ",Y");
            p+=2;
        };
        var implied = function(name) {
            log(name);
        };
        var immediate = function(name) {
            log(name, " #$", rom.read(p+1)[0]);
            p+=1;
        };
        var indirect = function(name) {
            log(name, " ($", rom.read(p+1, 16)[0], ")");
            p+=2;
        };
        var indirectX = function(name) {
            log(name, " ($", rom.read(p+1, 8)[0], ",X)");
            p+=1;
        };
        var indirectY = function(name) {
            log(name, " ($", rom.read(p+1, 8)[0], "),Y");
            p+=1;
        };
        var relative = function(name) {
            log(name, " $", rom.read(p+1)[0]);
            p+=1;
        };
        var zeroPage = function(name) {
            log(name, " $", rom.read(p+1)[0]);
            p+=1;
        };
        var zeroPageX = function(name) {
            log(name, " $", rom.read(p+1)[0], ",X");
            p+=1;
        };
        var zeroPageY = function(name) {
            log(name, " $", rom.read(p+1)[0], ",Y");
            p+=1;
        };

        var opcode = rom.read(p)[0];
        // record opcode frequency
        if (opcode in count) count[opcode]++;
        else count[opcode] = 1;

        switch (opcode) {
            case 0x00: implied("BRK"); break;
            case 0x01: indirectX("ORA"); break;
            case 0x02: implied("KIL"); break;
            case 0x03: indirectX("SLO"); break;
            case 0x04: zeroPage("NOP"); break;
            case 0x05: zeroPage("ORA"); break;
            case 0x06: zeroPage("ASL"); break;
            case 0x07: zeroPage("SLO"); break;
            case 0x08: implied("PHP"); break;
            case 0x09: immediate("ORA"); break;
            case 0x0A: accumulator("ASL"); break;
            case 0x0B: immediate("ANC"); break;
            case 0x0C: absolute("NOP"); break;
            case 0x0D: absolute("ORA"); break;
            case 0x0E: absolute("ASL"); break;
            case 0x0F: absolute("SLO"); break;
            case 0x10: relative("BPL"); break;
            case 0x11: indirectY("ORA"); break;
            case 0x12: implied("KIL"); break;
            case 0x13: indirectY("SLO"); break;
            case 0x14: zeroPageX("NOP"); break;
            case 0x15: zeroPageX("ORA"); break;
            case 0x16: zeroPageX("ASL"); break;
            case 0x17: zeroPageX("SLO"); break;
            case 0x18: implied("CLC"); break;
            case 0x19: absoluteY("ORA"); break;
            case 0x1A: accumulator("NOP"); break;
            case 0x1B: absoluteY("SLO"); break;
            case 0x1C: absoluteX("NOP"); break;
            case 0x1D: absoluteX("ORA"); break;
            case 0x1E: absoluteX("ASL"); break;
            case 0x1F: absoluteX("SLO"); break;
            case 0x20: absolute("JSR"); break;
            case 0x21: indirectX("AND"); break;
            case 0x22: implied("KIL"); break;
            case 0x23: indirectX("RLA"); break;
            case 0x24: zeroPage("BIT"); break;
            case 0x25: zeroPage("AND"); break;
            case 0x26: zeroPage("ROL"); break;
            case 0x27: zeroPage("RLA"); break;
            case 0x28: implied("PLP"); break;
            case 0x29: immediate("AND"); break;
            case 0x2A: accumulator("ROL"); break;
            case 0x2B: immediate("ANC"); break;
            case 0x2C: absolute("BIT"); break;
            case 0x2D: absolute("AND");break;
            case 0x2E: absolute("ROL"); break;
            case 0x2F: absolute("RLA"); break;
            case 0x30: relative("BMI"); break;
            case 0x31: indirectY("AND"); break;
            case 0x32: implied("KIL"); break;
            case 0x33: indirectY("RLA"); break;
            case 0x34: zeroPageX("NOP"); break;
            case 0x35: zeroPageX("AND"); break;
            case 0x36: zeroPageX("ROL"); break;
            case 0x37: zeroPageX("RLA"); break;
            case 0x38: implied("SEC"); break;
            case 0x39: absoluteY("AND"); break;
            case 0x3A: accumulator("NOP"); break;
            case 0x3B: absoluteY("RLA"); break;
            case 0x3C: absoluteX("NOP"); break;
            case 0x3D: absoluteX("AND"); break;
            case 0x3E: absoluteX("ROL"); break;
            case 0x3F: absoluteX("RLA"); break;
            case 0x40: implied("RTI"); break;
            case 0x41: indirectX("EOR"); break;
            case 0x42: implied("KIL"); break;
            case 0x43: indirectX("SRE"); break;
            case 0x44: zeroPage("NOP"); break;
            case 0x45: zeroPage("EOR"); break;
            case 0x46: zeroPage("LSR"); break;
            case 0x47: zeroPage("SRE"); break;
            case 0x48: implied("PHA"); break;
            case 0x49: immediate("EOR"); break;
            case 0x4A: accumulator("LSR"); break;
            case 0x4B: immediate("ALR"); break;
            case 0x4C: absolute("JMP"); break;
            case 0x4D: absolute("EOR"); break;
            case 0x4E: absolute("LSR"); break;
            case 0x4F: absolute("SRE"); break;
            case 0x50: relative("BVC"); break;
            case 0x51: indirectY("EOR"); break;
            case 0x52: implied("KIL"); break;
            case 0x53: indirectY("SRE"); break;
            case 0x54: zeroPageX("NOP"); break;
            case 0x55: zeroPageX("EOR"); break;
            case 0x56: zeroPageX("LSR"); break;
            case 0x57: zeroPageX("SRE"); break;
            case 0x58: implied("CLI"); break;
            case 0x59: absoluteY("EOR"); break;
            case 0x5A: accumulator("NOP"); break;
            case 0x5B: absoluteY("SRE"); break;
            case 0x5C: absoluteX("NOP"); break;
            case 0x5D: absoluteX("EOR"); break;
            case 0x5E: absoluteX("LSR"); break;
            case 0x5F: absoluteX("SRE"); break;
            case 0x60: implied("RTS"); break;
            case 0x61: indirectX("ADC"); break;
            case 0x62: implied("KIL"); break;
            case 0x63: indirectX("RRA"); break;
            case 0x64: zeroPage("NOP"); break;
            case 0x65: zeroPage("ADC"); break;
            case 0x66: zeroPage("ROR"); break;
            case 0x67: zeroPage("RRA"); break;
            case 0x68: implied("PLA"); break;
            case 0x69: immediate("ADC"); break;
            case 0x6A: accumulator("ROR"); break;
            case 0x6B: immediate("ARR"); break;
            case 0x6C: indirect("JMP"); break;
            case 0x6D: absolute("ADC"); break;
            case 0x6E: absolute("ROR"); break;
            case 0x6F: absolute("RRA"); break;
            case 0x70: relative("BVS"); break;
            case 0x71: indirectY("ADC"); break;
            case 0x72: implied("KIL"); break;
            case 0x73: indirectY("RRA"); break;
            case 0x74: zeroPageX("NOP"); break;
            case 0x75: zeroPageX("ADC"); break;
            case 0x76: zeroPageX("ROR"); break;
            case 0x77: zeroPageX("RRA"); break;
            case 0x78: implied("SEI"); break;
            case 0x79: absoluteY("ADC"); break;
            case 0x7A: accumulator("NOP"); break;
            case 0x7B: absoluteY("RRA"); break;
            case 0x7C: absoluteX("NOP"); break;
            case 0x7D: absoluteX("ADC"); break;
            case 0x7E: absoluteX("ROR"); break;
            case 0x7F: absoluteX("RRA"); break;
            case 0x80: immediate("NOP"); break;
            case 0x81: indirectX("STA"); break;
            case 0x82: immediate("NOP"); break;
            case 0x83: indirectX("SAX"); break;
            case 0x84: zeroPage("STY"); break;
            case 0x85: zeroPage("STA"); break;
            case 0x86: zeroPage("STX"); break;
            case 0x87: zeroPage("SAX"); break;
            case 0x88: implied("DEY"); break;
            case 0x89: immediate("NOP"); break;
            case 0x8A: implied("TXA"); break;
            case 0x8B: immediate("XAA"); break;
            case 0x8C: absolute("STY"); break;
            case 0x8D: absolute("STA"); break;
            case 0x8E: absolute("STX"); break;
            case 0x8F: absolute("SAX"); break;
            case 0x90: relative("BCC"); break;
            case 0x91: indirectY("STA"); break;
            case 0x92: implied("KIL"); break;
            case 0x93: indirectY("AHX"); break;
            case 0x94: zeroPageX("STY"); break;
            case 0x95: zeroPageX("STA"); break;
            case 0x96: zeroPageY("STX"); break;
            case 0x97: zeroPageY("SAX"); break;
            case 0x98: implied("TYA"); break;
            case 0x99: absoluteY("STA"); break;
            case 0x9A: implied("TXS"); break;
            case 0x9B: absoluteY("TAS"); break;
            case 0x9C: absoluteX("SHY"); break;
            case 0x9D: absoluteX("STA"); break;
            case 0x9E: absoluteY("SHX"); break;
            case 0x9F: absoluteY("AHX"); break;
            case 0xA0: immediate("LDY");break;
            case 0xA1: indirectX("LDA"); break;
            case 0xA2: immediate("LDX"); break;
            case 0xA3: indirectX("LAX"); break;
            case 0xA4: zeroPage("LDY"); break;
            case 0xA5: zeroPage("LDA"); break;
            case 0xA6: zeroPage("LDX"); break;
            case 0xA7: zeroPage("LAX"); break;
            case 0xA8: implied("TAY"); break;
            case 0xA9: immediate("LDA"); break;
            case 0xAA: implied("TAX"); break;
            case 0xAB: immediate("LAX"); break;
            case 0xAC: absolute("LDY"); break;
            case 0xAD: absolute("LDA"); break;
            case 0xAE: absolute("LDX"); break;
            case 0xAF: absolute("LAX"); break;
            case 0xB0: relative("BCS"); break;
            case 0xB1: indirectY("LDA"); break;
            case 0xB2: implied("KIL"); break;
            case 0xB3: indirectY("LAX"); break;
            case 0xB4: zeroPageX("LDY"); break;
            case 0xB5: zeroPageX("LDA"); break;
            case 0xB6: zeroPageY("LDX"); break;
            case 0xB7: zeroPageY("LAX"); break;
            case 0xB8: implied("CLV"); break;
            case 0xB9: absoluteY("LDA"); break;
            case 0xBA: implied("TSX"); break;
            case 0xBB: absoluteY("LAS"); break;
            case 0xBC: absoluteX("LDY"); break;
            case 0xBD: absoluteX("LDA"); break;
            case 0xBE: absoluteY("LDX"); break;
            case 0xBF: absoluteY("LAX"); break;
            case 0xC0: immediate("CPY"); break;
            case 0xC1: indirectX("CMP"); break;
            case 0xC2: immediate("NOP"); break;
            case 0xC3: indirectX("DCP"); break;
            case 0xC4: zeroPage("CPY"); break;
            case 0xC5: zeroPage("CMP"); break;
            case 0xC6: zeroPage("DEC"); break;
            case 0xC7: zeroPage("DCP"); break;
            case 0xC8: implied("INY"); break;
            case 0xC9: immediate("CMP"); break;
            case 0xCA: implied("DEX"); break;
            case 0xCB: immediate("AXS"); break;
            case 0xCC: absolute("CPY"); break;
            case 0xCD: absolute("CMP"); break;
            case 0xCE: absolute("DEC"); break;
            case 0xCF: absolute("DCP"); break;
            case 0xD0: relative("BNE"); break;
            case 0xD1: indirectY("CMP"); break;
            case 0xD2: implied("KIL"); break;
            case 0xD3: indirectY("DCP"); break;
            case 0xD4: zeroPageX("NOP"); break;
            case 0xD5: zeroPageX("CMP"); break;
            case 0xD6: zeroPageX("DEC"); break;
            case 0xD7: zeroPageX("DCP"); break;
            case 0xD8: implied("CLD"); break;
            case 0xD9: absoluteY("CMP"); break;
            case 0xDA: accumulator("NOP"); break;
            case 0xDB: absoluteY("DCP"); break;
            case 0xDC: absoluteX("NOP"); break;
            case 0xDD: absoluteX("CMP"); break;
            case 0xDE: absoluteX("DEC"); break;
            case 0xDF: absoluteX("DCP"); break;
            case 0xE0: immediate("CPX"); break;
            case 0xE1: indirectX("SBC"); break;
            case 0xE2: immediate("NOP"); break;
            case 0xE3: indirectX("ISC"); break;
            case 0xE4: zeroPage("CPX"); break;
            case 0xE5: zeroPage("SBC"); break;
            case 0xE6: zeroPage("INC"); break;
            case 0xE7: zeroPage("ISC"); break;
            case 0xE8: implied("INX"); break;
            case 0xE9: immediate("SBC"); break;
            case 0xEA: accumulator("NOP"); break;
            case 0xEB: immediate("SBC"); break;
            case 0xEC: absolute("CPX"); break;
            case 0xED: absolute("SBC"); break;
            case 0xEE: absolute("INC"); break;
            case 0xEF: absolute("ISC"); break;
            case 0xF0: relative("BEQ"); break;
            case 0xF1: indirectY("SBC"); break;
            case 0xF2: implied("KIL"); break;
            case 0xF3: indirectY("ISC"); break;
            case 0xF4: zeroPageX("NOP"); break;
            case 0xF5: zeroPageX("SBC"); break;
            case 0xF6: zeroPageX("INC"); break;
            case 0xF7: zeroPageX("ISC"); break;
            case 0xF8: implied("SED"); break;
            case 0xF9: absoluteY("SBC"); break;
            case 0xFA: accumulator("NOP"); break;
            case 0xFB: absoluteY("ISC"); break;
            case 0xFC: absoluteX("NOP"); break;
            case 0xFD: absoluteX("SBC"); break;
            case 0xFE: absoluteX("INC"); break;
            case 0xFF: absoluteX("ISC"); break;

            default:
                for (var s in count) {
                    log(parseInt(s), ": ", count[s]);
                }
                log(opcode, " NOT FOUND!"); return;
        }
        // cursor move forward by default
        return p+1;
    };
    var disassemble = function(rom) {
        // starting position
        var p = 0x10;
        while (p < rom.sizePRG)
            p = fetch(rom, p);
    };
    return {
        fetch: fetch,
        disassemble: disassemble
    }
});