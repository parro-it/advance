import {parse} from 'acorn';

export default function parseAst({filename, pl, content}) {
  const ast = parse(content, {ecmaVersion: 6, sourceType: 'module'});
  return {filename, pl, content, ast};
}
