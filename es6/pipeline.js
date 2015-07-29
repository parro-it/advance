

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

export default function pipeline(...transforms) {
  const run = pipeP(flatten(transforms));

  const pl = {
    appendNewFile(filename) {
      this.rootFile = this.rootFile || filename;
      return run({filename, pl});
    }

  };

  return pl;
}
