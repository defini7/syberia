export interface Token {
  type: string;
  value: string;
};

export function isNumeric(val: any) {
  return (val - parseFloat(val) + 1) >= 0;
}

export function isAlpha(val: any) {
  return /^[a-zA-Z]*$/gi.test(val);
}

function strmatch(a: String, b: String, start: number): boolean {
  for (let j = 0; j < b.length; j++) {
    if (a[start + j] != b[j]) {
      return false;
    }
  }

  return true;
}

export function analyze(input: String, token_list: Token[]): Token[] {
  let tokenized: Token[] = [];
  let cursor = 0;

  function next_token() {
    let num = "";
    let identifier = "";
    let str = "";

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

    for (const item in token_list) {
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
    const token = next_token();
    if (token.value.length != 0) {
      tokenized.push(token);
    }
  }

  return tokenized;
}