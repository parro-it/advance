import pipeline from '../es6/pipeline';
import readFile from '../es6/transforms/read-file';
import parseAst from '../es6/transforms/parse-ast';
import findDeps from '../es6/transforms/find-deps';
import tarFiles from '../es6/transforms/tar-files';
import { join } from 'path';
import { readFile as read } from 'mz/fs';
import { exec } from 'shelljs';
import { createWriteStream } from 'fs';

describe('tarFiles', () => {
  it('is a function', () => {
    tarFiles.should.be.a('function');
  });

  it('pack files to tar archive', async () => {
    const p = pipeline(
      readFile,
      parseAst,
      findDeps,
      tarFiles
    );

    await p.appendNewFile(join(__dirname, 'fixture/has-deps.js'));
    p.tarFile.should.be.an('object');
    const expectedTarContent = await read(
      join(__dirname, 'fixture/expected-tar-content.txt'),
      'utf8'
    );

    const writeStream = createWriteStream('/tmp/output.tar');

    const fileWritten = new Promise(resolve => {
      writeStream.on('finish', resolve);
    });
    p.tarFile.pipe(writeStream);
    p.tarFile.finalize();
    await fileWritten;

    const result = exec('tar -xOf /tmp/output.tar').output;
    result.should.be.equal(expectedTarContent);
  });
});
