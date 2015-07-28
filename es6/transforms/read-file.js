import { readFile } from 'mz/fs';

export default async function read(args) {
  args.content = await readFile(args.filename, 'utf8');
}
