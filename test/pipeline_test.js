import pipeline from '../es6/pipeline';

describe('pipeline', ()=> {
  it('is a function', () => {
    pipeline.should.be.a('function');
  });


  it('transforms could return non-promise', (done) => {
    const p2 = pipeline(
      ({filename}) => filename.toUpperCase()
    );

    p2.appendNewFile('lowercase.js').then(result => {
      result.should.be.equal('LOWERCASE.JS');
      done();
    });
  });


  it('transforms could return a promise', (done) => {
    const p1 = pipeline(
      ({filename}) => Promise.resolve(filename.toUpperCase())
    );


    p1.appendNewFile('lowercase.js').then(result => {
      result.should.be.equal('LOWERCASE.JS');
      done();
    });
  });


  it('transforms could append other files to pipeline', (done) => {
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

    p1.appendNewFile('lowercase.js').then( () => {
      results.should.be.deep.equal(['ANOTHERONE.CSS', 'LOWERCASE.JS']);
      done();
    });
  });


  it('pipeline accept arrays of transforms', (done) => {
    const inc = amount => ({filename}) => ({filename: filename + amount});
    const p1 = pipeline(
      inc(2),
      [inc(5), inc(10)],
      inc(25)
    );


    p1.appendNewFile(0).then(result => {
      result.filename.should.be.equal(42);
      done();
    });
  });
});
