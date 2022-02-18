import { readFileSync } from "fs";

import { analyze, Token } from "./lexer";

export interface NumberNode {
  token: Token,
  type: string;
}

export interface BinOpNode {
  op: Token,
  left: NumberNode,
  right: NumberNode,
  type: string;
}

export interface UnaryOpNode {
  op: Token,
  node: NumberNode | UnaryOpNode | null,
  type: string;
}

const tokens: Token[] = [
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

const input = readFileSync('test.parser', 'utf8').toString();
const tokenized = analyze(input, tokens);

let cursor = 0;
let currentToken: Token;
export let nodes: any[] = [];

function get_next() {
  cursor++;
  if (cursor < tokenized.length) {
    currentToken = tokenized[cursor];
  }

  return currentToken;
}

function factor(): NumberNode | UnaryOpNode | null {
  const tok = tokenized[cursor];

  if (tok == undefined) {
    return null;
  }

  if (['add', 'sub'].includes(tok.type)) {
    get_next();
    let fact = factor();
    let res: UnaryOpNode = {
      op: tok,
      node: fact,
      type: 'unaryop'
    };

    nodes.splice(nodes.length - 1);
    nodes.push(res);

    return res;
  }

  if (tok.type == 'number') {
    get_next();
    nodes.push({ token: tok, type: 'number' });
    return nodes[nodes.length - 1];
  }

  if (tok.type == 'lparen') {
    get_next();
    const expression = expr();
    if (currentToken.type == 'rparen') {
      get_next();
      nodes.push(expr());
      return expression;
    }
  }

  return null;
}

function binOp(func: Function, ops: String[]) {
  let left: any = func();

  while (ops.includes(currentToken.type)) {
    const opTok = currentToken;
    get_next();
    const right = func();
    left = {
      op: opTok,
      left: left,
      right: right,
      type: 'binop'
    };

    nodes.splice(nodes.length - 1);
    nodes.splice(nodes.length - 2);
    nodes.splice(nodes.length - 3);
  }

  nodes.push(left);

  return left;
}

function term() {
  return binOp(factor, ['mul', 'div']);
}

function expr() {
  return binOp(term, ['add', 'sub']);
}

export function parse() {
  return expr();
}
