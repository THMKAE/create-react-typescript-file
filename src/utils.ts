import fs from 'fs';
import path from 'path';

export const log = {
  e: (message: string, exit?: boolean) => {
    console.error(message);
    if (exit) process.exit(0);
  },
  i: (message: string) => console.info(message),
};

export const doesPathExist = (dir: string) => {
  return fs.existsSync(dir);
};

export const pathResolver = (...dirArgs: string[]) => {
  return path.resolve(...dirArgs);
};

export const createDirectory = (directory: string) => {
  fs.mkdirSync(directory);
  log.i(`✅ Created directory at "${directory}"`);
};

export const createFile = (path: string, content: string, name: string) => {
  fs.writeFileSync(path, content);
  log.i(`✅ Created "${name}" file`);
};
