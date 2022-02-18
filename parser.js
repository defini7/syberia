"use strict";
exports.__esModule = true;
exports.parse = exports.nodes = void 0;
var fs_1 = require("fs");
var lexer_1 = require("./lexer");
var tokens = [
    { type: 'add', value: '+' },
    { type: 'sub', value: '-' },
    { type: 'mul', value: '*' },
    { type: 'div', value: '/' },
    { type: 'mod', value: '%' },
    { type: 'pow', value: '^' },
    { type: 'comma', value: ',' },
    { type: 'quote', value: '"' },
    { type: 'lparen', value: '(' },
    { type: 'rparen', value: ')' },
    { type: 'equals', value: '=' },
    { type: 'comma', value: ',' },
    { type: 'notequals', value: '!=' },
    { type: 'newline', value: '\n' },
    { type: 'tab', value: '\t' },
    { type: 'carriage', value: '\r' },
    { type: 'comment', value: '\'' }
];
var input = (0, fs_1.readFileSync)('test.parser', 'utf8').toString();
var tokenized = (0, lexer_1.analyze)(input, tokens);
var cursor = 0;
var currentToken;
exports.nodes = [];
function get_next() {
    cursor++;
    if (cursor < tokenized.length) {
        currentToken = tokenized[cursor];
    }
    return currentToken;
}
function factor() {
    var tok = tokenized[cursor];
    if (tok == undefined) {
        return null;
    }
    if (['add', 'sub'].includes(tok.type)) {
        get_next();
        var fact = factor();
        var res = {
            op: tok,
            node: fact,
            type: 'unaryop'
        };
        exports.nodes.splice(exports.nodes.length - 1);
        exports.nodes.push(res);
        return res;
    }
    if (tok.type == 'number') {
        get_next();
        exports.nodes.push({ token: tok, type: 'number' });
        return exports.nodes[exports.nodes.length - 1];
    }
    if (tok.type == 'lparen') {
        get_next();
        var expression = expr();
        if (currentToken.type == 'rparen') {
            get_next();
            exports.nodes.push(expr());
            return expression;
        }
    }
    return null;
}
function binOp(func, ops) {
    var left = func();
    while (ops.includes(currentToken.type)) {
        var opTok = currentToken;
        get_next();
        var right = func();
        left = {
            op: opTok,
            left: left,
            right: right,
            type: 'binop'
        };
        exports.nodes.splice(exports.nodes.length - 1);
        exports.nodes.splice(exports.nodes.length - 2);
        exports.nodes.splice(exports.nodes.length - 3);
    }
    exports.nodes.push(left);
    return left;
}
function term() {
    return binOp(factor, ['mul', 'div']);
}
function expr() {
    return binOp(term, ['add', 'sub']);
}
function parse() {
    return expr();
}
exports.parse = parse;
