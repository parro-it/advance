import {parse} from 'acorn';

export default async function parseAst(args) {
  args.ast = parse(args.content, {ecmaVersion: 6, sourceType: 'module'});
}
