import tap from 'tap';
import pipeline from '../es6/pipeline';
import readFile from '../es6/transforms/read-file';
import { join } from 'path';

const toupper = ({filename, pl, content}) => ({filename, pl, content: content.toUpperCase()});


tap.test('readFile is a function', t => {
  t.equal(typeof readFile, 'function');

  t.end();
});


tap.test('add file content to results', t => {
  const p = pipeline(
    readFile,
    toupper
  );


  p.appendNewFile(join(__dirname, 'fixture/fixture1.txt')).then( ({content}) => {
    t.equal(content, 'FIXTURE1 CONTENT\n');
    t.end();
  });
});
