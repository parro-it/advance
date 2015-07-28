import pipeline from '../es6/pipeline';
import readFile from '../es6/transforms/read-file';
import { join } from 'path';

const toupper = ({filename, pl, content}) => ({filename, pl, content: content.toUpperCase()});

describe('readFile', () => {
  it('is a function', () => {
    readFile.should.be.a('function');
  });


  it('add file content to results', (done) => {
    const p = pipeline(
      readFile,
      toupper
    );


    p.appendNewFile(join(__dirname, 'fixture/fixture1.txt')).then( ({content}) => {
      content.should.be.equal('FIXTURE1 CONTENT\n');
      done();
    });
  });
});
