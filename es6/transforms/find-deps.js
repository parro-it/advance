import detectiveEs6 from 'detective-es6';
import detective from 'detective';
import { default as _resolve } from 'resolve';
import { dirname } from 'path';
import thenify from 'thenify';
import isCoreModule from 'is-core-module';

const resolve = thenify(_resolve);


export default async function findDeps(args) {
  args.pl.parsedFiles = args.pl.parsedFiles || {};

  args.pl.parsedFiles[args.filename] = true;

  const deps6 = detectiveEs6(args.ast);
  const deps5 = detective(args.content, {
    parse: {
      ecmaVersion: 6,
      sourceType: 'module'
    }
  });
  const deps = deps6.concat(deps5);
  const basedir = dirname(args.filename);

  for (let dep of deps) {
    const [ absPath ] = await resolve(dep, { basedir });
    if (isCoreModule(dep)) {
      console.log('skipping core module ', dep);  // eslint-disable-line no-console
    } else {
      if (!(absPath in args.pl.parsedFiles) && !absPath.endsWith('.json')) {
        // console.log('find dep ', dep);
        await args.pl.appendNewFile(absPath);
      }
    }
  }
}
