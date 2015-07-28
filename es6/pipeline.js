

const flatten = ([first, ...rest]) => {
  if (first === undefined) {
    return [];
  }

  if (!Array.isArray(first)) {
    return [first, ...flatten(rest)];
  }

  return [...flatten(first), ...flatten(rest)];
};


const pipeP = fns => async (...args) => {
  const a = args;
  let result = await Promise.resolve( fns[0](...a) );
  if (fns.length === 1) {
    return result;
  }
  for (let fn of fns.slice(1)) {
    result = await Promise.resolve( fn(result) );
  }
  return result;
};

export default function pipeline(...transforms) {
  const run = pipeP(flatten(transforms));

  const pl = {
    appendNewFile(filename) {
      return run({filename, pl});
    }

  };

  return pl;
}
