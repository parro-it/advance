import tap from 'tap';
import pipeline from '../es6/pipeline';
import readFile from '../es6/transforms/read-file';
import parseAst from '../es6/transforms/parse-ast';
import { join } from 'path';


tap.test('parseAst is a function', t => {
  t.equal(typeof parseAst, 'function');

  t.end();
});


tap.test('add ast to results', t => {
  const p = pipeline(
    readFile,
    parseAst
  );


  p.appendNewFile(join(__dirname, 'fixture/response.js')).then( ({ast}) => {
    t.similar(ast, {
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
  });
});
