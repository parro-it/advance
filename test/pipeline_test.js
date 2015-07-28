import tap from 'tap';
import pipeline from '../es6/pipeline';

tap.test('pipeline is a function', t => {
  t.equal(typeof pipeline, 'function');

  t.end();
});


tap.test('transforms could return non-promise', t => {
  const p2 = pipeline(
    ({filename}) => filename.toUpperCase()
  );

  p2.appendNewFile('lowercase.js').then(result => {
    t.equal(result, 'LOWERCASE.JS');
    t.end();
  });
});


tap.test('transforms could return a promise', t => {
  const p1 = pipeline(
    ({filename}) => Promise.resolve(filename.toUpperCase())
  );


  p1.appendNewFile('lowercase.js').then(result => {
    t.equal(result, 'LOWERCASE.JS');
    t.end();
  });
});


tap.test('transforms could append other files to pipeline', t => {
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
    t.similar(results, ['ANOTHERONE.CSS', 'LOWERCASE.JS']);
    t.end();
  });
});


tap.test('pipeline accept arrays of transforms', t => {
  const inc = amount => ({filename}) => ({filename: filename + amount});
  const p1 = pipeline(
    inc(2),
    [inc(5), inc(10)],
    inc(25)
  );


  p1.appendNewFile(0).then(result => {
    t.equal(result.filename, 42);
    t.end();
  });
});
