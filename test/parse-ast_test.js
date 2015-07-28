import pipeline from '../es6/pipeline';
import readFile from '../es6/transforms/read-file';
import parseAst from '../es6/transforms/parse-ast';
import { join } from 'path';


describe('parseAst', () => {
  it('is a function', () => {
    parseAst.should.be.a('function');
  });


  it('add ast to results', (done) => {
    const p = pipeline(
      readFile,
      parseAst
    );


    p.appendNewFile(join(__dirname, 'fixture/response.js')).then( ({ast}) => {
      ast.should.be.deep.equal({
        type: 'Program',
        start: 0,
        end: 28,
        body: [
          {
            type: 'ExportNamedDeclaration',
            start: 0,
            end: 27,
            declaration: {
              type: 'VariableDeclaration',
              start: 7,
              end: 27,
              declarations: [
                {
                  type: 'VariableDeclarator',
                  start: 13,
                  end: 26,
                  id: {
                    type: 'Identifier',
                    start: 13,
                    end: 21,
                    name: 'response'
                  },
                  init: {
                    type: 'Literal',
                    start: 24,
                    end: 26,
                    value: 42,
                    raw: '42'
                  }
                }
              ],
              kind: 'const'
            },
            specifiers: [],
            source: null
          }
        ],
        sourceType: 'module'
      });
      done();
    });
  });
});
