import tar from 'tar-stream';
import { relative, dirname } from 'path';

export default function tarFiles(args) {
  if (!args.pl.tarFile) {
    args.pl.tarFile = tar.pack();
  }

  const tarFile = args.pl.tarFile;
  const rootDir = dirname(args.pl.rootFile);
  const relativeFilename = relative(rootDir, args.filename);
  tarFile.entry({ name: relativeFilename }, args.content);

  args.pl.on('end', () => tarFile.finalize());
}

