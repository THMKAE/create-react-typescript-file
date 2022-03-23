import fs from 'fs';
import path from 'path';

export const log = (...messages: string[]) => console.info(messages.join('\n'));

export const doesPathExist = (dir: string) => {
  return fs.existsSync(dir);
};

export const pathResolver = (...dirArgs: string[]) => {
  return path.resolve(...dirArgs);
};

export const createDirectory = (directory: string) => {
  try {
    fs.mkdirSync(directory);
    log(`✅ Created directory at "${directory}"`);
  } catch (error) {
    throw new Error(`❌ Unable to create directory at ${directory}\nError: ${error}`);
  }
};

export const createFile = (path: string, content: string, name: string) => {
  try {
    fs.writeFileSync(path, content);
    log(`✅ Created "${name}" file`);
  } catch (error) {
    throw new Error(`❌ Unable to create ${name} file\nError: ${error}`);
  }
};

export const getDirectoryFiles = (dir: string) => {
  try {
    return fs.readdirSync(dir);
  } catch (error) {
    throw new Error(`❌ Unable to read ${dir}\nError: ${error}`);
  }
};

export const readFile = (fileName: string) => {
  try {
    return fs.readFileSync(fileName, 'utf-8');
  } catch (error) {
    throw new Error(`❌ Unable to read ${fileName} file\nError: ${error}`);
  }
};

export const updateFile = (path: string, content: string, name: string) => {
  try {
    fs.writeFileSync(path, content);
  } catch (error) {
    throw new Error(`❌ Unable to read ${name} file\nError: ${error}`);
  }
};

export const runTask = (task: VoidFunction) => {
  try {
    task();
  } catch (error) {
    console.error(`\n❌ ${error}`);
  } finally {
    process.exit(0);
  }
};
