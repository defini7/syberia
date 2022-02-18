import { visit } from "./interpreter";
import { nodes, parse } from "./parser";

// tree is useless, but nodes are not
const tree = parse();

for (let i = 0; i < nodes.length; i++) {
  console.log(visit(nodes[i]));
}