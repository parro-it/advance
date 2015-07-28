import pipeline from '../es6/pipeline';
import readFile from '../es6/transforms/read-file';
import parseAst from '../es6/transforms/parse-ast';
import findDeps from '../es6/transforms/find-deps';
import { join, relative } from 'path';


describe('findDeps', () => {
  it('is a function', () => {
    findDeps.should.be.a('function');
  });

  async function parseFile(filePath) {
    const accumulator = accum => ({filename}) => accum.push(filename);

    const results = [];
    const p = pipeline(
      readFile,
      parseAst,
      findDeps,
      accumulator(results)
    );


    await p.appendNewFile(join(__dirname, filePath));
    const relatives = results.map(filename => relative(__dirname, filename));
    return relatives;
  }

  it('add dependencies to results', async () => {
    const result = await parseFile('fixture/has-deps.js');
    result.should.be.deep.equal([
        'fixture/response.js',
        'fixture/has-deps.js'
    ]);
  });

  it('support es5', async () => {
    const result = await parseFile('fixture/has-deps-es5.js');
    result.should.be.deep.equal([
        'fixture/response.js',
        'fixture/has-deps-es5.js'
    ]);
  });

  it('support recursive deps', async () => {
    const result = await parseFile('fixture/has-recursive-deps.js');
    result.should.be.deep.equal([
        'fixture/recursive.js',
        'fixture/has-recursive-deps.js'
    ]);
  });
});
