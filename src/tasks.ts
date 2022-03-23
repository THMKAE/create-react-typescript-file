import { Answers } from 'inquirer';
import { Config, Confirm, FolderNames } from './config';
import {
  generatePathValues,
  reviewParentDir,
  reviewComponentDir,
  createComponentDirectory,
  addToParentIndex,
  createComponentFiles,
  generateIndexPath,
  buildPrettier,
} from './helpers';
import { entryTemplates } from './templates';
import { createDirectory, createFile, doesPathExist, log, pathResolver, runTask } from './utils';

type TaskFunctionParams = {
  prettify: ReturnType<typeof buildPrettier>;
};

const taskRunner = (task: ({ prettify }: TaskFunctionParams) => void) => {
  log('\n');
  const prettify = buildPrettier();
  runTask(() => task({ prettify }));
};

export const setupTask = (config: Config) => (answers: Answers) => {
  taskRunner(({ prettify }) => {
    const { root } = answers;
    const configuration: Config = { ...config, root: root };
    createFile(
      pathResolver(process.cwd(), '.ctf-config.json'),
      prettify(JSON.stringify(configuration), true),
      '.ctf-config.json'
    );
  });
};

export const initTask = (config: Config) => (answers: Answers) => {
  taskRunner(({ prettify }) => {
    const { folders, createIndexFiles } = answers;
    (folders as Array<FolderNames>).forEach((folder) => {
      const folderPath = pathResolver(config.root, config.dirs[folder]);
      if (!doesPathExist(folderPath)) {
        createDirectory(folderPath);
        if (config.addIndexFileToRootFolders || createIndexFiles === Confirm.YES) {
          createFile(generateIndexPath(folderPath), prettify(entryTemplates.index), 'index.ts');
        }
      }
    });
  });
};

export const createTask = (config: Config) => (answers: Answers) => {
  taskRunner(({ prettify }) => {
    const { typeOfFile, fileName, fileDir, addCssModule } = answers;
    const { parentDir, componentDir, indexPath, filePath } = generatePathValues(
      fileDir,
      fileName,
      typeOfFile
    );
    reviewParentDir(parentDir);
    reviewComponentDir(componentDir, typeOfFile);
    createComponentDirectory(componentDir, typeOfFile);
    addToParentIndex(parentDir, fileName, prettify);
    createComponentFiles(
      fileName,
      indexPath,
      filePath,
      typeOfFile,
      config.addCSSModulesToComponent || addCssModule,
      componentDir,
      prettify
    );
  });
};
