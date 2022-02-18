"use strict";
exports.__esModule = true;
var interpreter_1 = require("./interpreter");
var parser_1 = require("./parser");
// tree is useless, but nodes are not
var tree = (0, parser_1.parse)();
for (var i = 0; i < parser_1.nodes.length; i++) {
    console.log((0, interpreter_1.visit)(parser_1.nodes[i]));
}
