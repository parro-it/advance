import {parse} from 'acorn';

export default async function parseAst(args) {
  args.pl.parseOptions = args.pl.parseOptions || {
    ecmaVersion: 6,
    sourceType: 'module'
  };

  args.ast = parse(args.content, args.pl.parseOptions);
}
