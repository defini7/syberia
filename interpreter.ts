import { BinOpNode, NumberNode, UnaryOpNode } from "./parser";

function visitNumberNode(node: NumberNode) {
  return parseFloat(node.token.value);
}

function visitBinOpNode(node: BinOpNode) {
  const left: any = visit(node.left);
  const right: any = visit(node.right);

  switch (node.op.type) {
    case 'add': return parseFloat(left) + parseFloat(right);
    case 'sub': return parseFloat(left) - parseFloat(right);
    case 'mul': return parseFloat(left) * parseFloat(right);
    case 'div': return parseFloat(left) / parseFloat(right);
    case 'mod': return parseFloat(left) % parseFloat(right);
  }
}

function visitUnaryOpNode(node: UnaryOpNode) {
  const num: any = visit(node.node);

  if (node.op.type == 'sub') {
    return num * -1;
  }

  return num;
}

export function visit(node: any) {
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