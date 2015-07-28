import pipeline from '../es6/pipeline';
import readFile from '../es6/transforms/read-file';
import { join } from 'path';

const toupper = async (args) => (args.content = args.content.toUpperCase());

describe('readFile', () => {
  it('is a function', () => {
    readFile.should.be.a('function');
  });


  it('add file content to results', async () => {
    const p = pipeline(
      readFile,
      toupper
    );


    const {content} = await p.appendNewFile(join(__dirname, 'fixture/fixture1.txt'));
    content.should.be.equal('FIXTURE1 CONTENT\n');
  });
});
