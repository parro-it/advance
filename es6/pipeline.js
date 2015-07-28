

const flatten = ([first, ...rest]) => {
  if (first === undefined) {
    return [];
  }

  if (!Array.isArray(first)) {
    return [first, ...flatten(rest)];
  }

  return [...flatten(first), ...flatten(rest)];
};


const pipeP = fns => async (args) => {
  await Promise.resolve( fns[0](args) );
  if (fns.length === 1) {
    return args;
  }
  for (let fn of fns.slice(1)) {
    await Promise.resolve( fn(args) );
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
