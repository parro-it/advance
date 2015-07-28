import pipeline from '../es6/pipeline';

describe('pipeline', ()=> {
  it('is a function', () => {
    pipeline.should.be.a('function');
  });


  it('transforms could return non-promise', async () => {
    const p2 = pipeline(
      ({filename}) => filename.toUpperCase()
    );

    const result = await p2.appendNewFile('lowercase.js');
    result.should.be.equal('LOWERCASE.JS');
  });


  it('transforms could return a promise', async () => {
    const p1 = pipeline(
      ({filename}) => Promise.resolve(filename.toUpperCase())
    );


    const result = await p1.appendNewFile('lowercase.js');
    result.should.be.equal('LOWERCASE.JS');
  });


  it('transforms could append other files to pipeline', async () => {
    const accumulator = accum => filename => accum.push(filename);
    const tolower = ({filename, pl}) => {
      if (filename === 'lowercase.js') {
        pl.appendNewFile('anotherone.css');
      }
      return Promise.resolve(filename.toUpperCase());
    };

    const results = [];

    const p1 = pipeline(
      tolower,
      accumulator(results)
    );

    await p1.appendNewFile('lowercase.js');
    results.should.be.deep.equal(['ANOTHERONE.CSS', 'LOWERCASE.JS']);
  });


  it('pipeline accept arrays of transforms', async () => {
    const inc = amount => ({filename}) => ({filename: filename + amount});
    const p1 = pipeline(
      inc(2),
      [inc(5), inc(10)],
      inc(25)
    );


    const result = await p1.appendNewFile(0);
    result.filename.should.be.equal(42);
  });
});
