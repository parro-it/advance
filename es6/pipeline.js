import EventEmitter from 'events';

const flatten = ([first, ...rest]) => {
  if (first === undefined) {
    return [];
  }

  if (!Array.isArray(first)) {
    return [first, ...flatten(rest)];
  }

  return [...flatten(first), ...flatten(rest)];
};

const isThenable = o => typeof o === 'object' && typeof o.then === 'function';

const pipeP = fns => async (args) => {
  const firstResult = fns[0](args);
  if (isThenable(firstResult)) {
    await firstResult;
  }

  if (fns.length === 1) {
    return args;
  }
  for (let fn of fns.slice(1)) {
    let result = fn(args);
    if (isThenable(result)) {
      await result;
    }
  }
  return args;
};


class Pipeline extends EventEmitter {

  constructor(...transforms) {
    super();
    this.results = [];
    this.run = pipeP(flatten(transforms.concat([this.collect.bind(this)])));
  }

  async collect(args) {
    this.results.push(args);
  }

  async appendNewFile(filename) {
    this.rootFile = this.rootFile || filename;
    const result = await this.run({filename, pl: this});
    if (filename === this.rootFile) {
      this.emit('end');
    }
    return result;
  }
}

export default function pipeline(...transforms) {
  return new Pipeline(transforms);
}
