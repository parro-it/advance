import R from 'ramda';

const guardNonPromise = fn => (...args) => {
  try {
    const result = fn(...args);
    return Promise.resolve( result );
  } catch(err) {
    console.log(err.stack); // eslint-disable-line no-console
  }
};

const makePipe = R.compose(

  R.map(guardNonPromise),
  R.flatten

);


export default function pipeline(...transforms) {
  const run = R.pipeP(...makePipe(transforms));

  const pl = {
    appendNewFile(filename) {
      return run({filename, pl});
    }

  };

  return pl;
}
