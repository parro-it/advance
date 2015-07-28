import { readFile } from 'mz/fs';

export default function read({filename, pl}) {
  return readFile(filename, 'utf8')
    .then(content => ({filename, pl, content}));
}
