import pipeline from '../es6/pipeline';

describe('pipeline', ()=> {
  it('is a function', () => {
    pipeline.should.be.a('function');
  });


  it('transforms could return non-promise', async () => {
    const p2 = pipeline(
      async (args) => {
        args.filename = args.filename.toUpperCase();
      }
    );

    const { filename } = await p2.appendNewFile('lowercase.js');
    filename.should.be.equal('LOWERCASE.JS');
  });


  it('propagate exceptions', async () => {
    const p2 = pipeline(
      () => { throw new Error('something bad'); }
    );
    let message = 'no exception thrown';
    try {
      await p2.appendNewFile('lowercase.js');
    } catch(err) {
      message = err.message;
    }

    message.should.be.equal('something bad');
  });


  it('transforms could return a promise', async () => {
    const p1 = pipeline(
      async (args) => {
        args.filename = args.filename.toUpperCase();
      }
    );


    const { filename } = await p1.appendNewFile('lowercase.js');
    filename.should.be.equal('LOWERCASE.JS');
  });

  const tolower = async (args) => {
    if (args.filename === 'lowercase.js') {
      await args.pl.appendNewFile('anotherone.css');
    }
    args.filename = args.filename.toUpperCase();
  };

  it('transforms could append other files to pipeline', async () => {
    const accumulator = accum => ({filename}) => accum.push(filename);


    const results = [];

    const p1 = pipeline(
      tolower,
      accumulator(results)
    );

    await p1.appendNewFile('lowercase.js');
    results.should.be.deep.equal(['ANOTHERONE.CSS', 'LOWERCASE.JS']);
  });


  it('emit `end` event when first file complete the pipeline', async () => {
    const p1 = pipeline(
      tolower,
      tolower
    );

    let eventFired = false;
    p1.on('end', () => eventFired = true);
    await p1.appendNewFile('lowercase.js');
    eventFired.should.be.deep.equal(true);
  });


  it('accept arrays of transforms as arguments', async () => {
    const inc = amount => args => (args.filename = args.filename + amount);
    const p1 = pipeline(
      inc(2),
      [inc(5), inc(10)],
      inc(25)
    );


    const result = await p1.appendNewFile(0);
    result.filename.should.be.equal(42);
  });

  it('is fast with normal function in pipeline', async () => {
    const inc = args => (args.filename = args.filename + 10);
    const incs = [];

    for (let i = 0; i < 5000; i++) {
      incs.push(inc);
    }
    const p1 = pipeline(...incs);


    const result = await p1.appendNewFile(0);
    result.filename.should.be.equal(50000);
  });
});
