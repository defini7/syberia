"use strict";
exports.__esModule = true;
exports.visit = void 0;
function visitNumberNode(node) {
    return parseFloat(node.token.value);
}
function visitBinOpNode(node) {
    var left = visit(node.left);
    var right = visit(node.right);
    switch (node.op.type) {
        case 'add': return parseFloat(left) + parseFloat(right);
        case 'sub': return parseFloat(left) - parseFloat(right);
        case 'mul': return parseFloat(left) * parseFloat(right);
        case 'div': return parseFloat(left) / parseFloat(right);
        case 'mod': return parseFloat(left) % parseFloat(right);
    }
}
function visitUnaryOpNode(node) {
    var num = visit(node.node);
    if (node.op.type == 'sub') {
        return num * -1;
    }
    return num;
}
function visit(node) {
    if (node.type == 'unaryop') {
        return visitUnaryOpNode(node);
    }
    if (node.type == 'binop') {
        return visitBinOpNode(node);
    }
    if (node.type == 'number') {
        return visitNumberNode(node);
    }
}
exports.visit = visit;
