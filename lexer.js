"use strict";
exports.__esModule = true;
exports.analyze = exports.isAlpha = exports.isNumeric = void 0;
;
function isNumeric(val) {
    return (val - parseFloat(val) + 1) >= 0;
}
exports.isNumeric = isNumeric;
function isAlpha(val) {
    return /^[a-zA-Z]*$/gi.test(val);
}
exports.isAlpha = isAlpha;
function strmatch(a, b, start) {
    for (var j = 0; j < b.length; j++) {
        if (a[start + j] != b[j]) {
            return false;
        }
    }
    return true;
}
function analyze(input, token_list) {
    var tokenized = [];
    var cursor = 0;
    function next_token() {
        var num = "";
        var identifier = "";
        var str = "";
        while (isNumeric(input[cursor]) || (input[cursor] == '.')) {
            num += input[cursor];
            cursor++;
            if ((num.length > 0) && (!isNumeric(input[cursor])) && (input[cursor] != '.')) {
                return { type: 'number', value: num };
            }
        }
        if (input[cursor] == '"') {
            cursor++;
            while (input[cursor] != '"') {
                str += input[cursor++];
            }
            cursor++;
            return { type: 'string', value: str };
        }
        for (var item in token_list) {
            if (strmatch(input, token_list[item].value, cursor)) {
                cursor += token_list[item].value.length;
                return token_list[item];
            }
        }
        while ((isAlpha(input[cursor]) || isNumeric(input[cursor])) && cursor < input.length) {
            identifier += input[cursor];
            cursor++;
        }
        if (identifier.length == 0) {
            cursor++;
        }
        return { type: 'indentifier', value: identifier };
    }
    while (cursor < input.length) {
        var token = next_token();
        if (token.value.length != 0) {
            tokenized.push(token);
        }
    }
    return tokenized;
}
exports.analyze = analyze;
