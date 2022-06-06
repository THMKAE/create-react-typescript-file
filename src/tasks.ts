import { Answers } from 'inquirer';
import { Config, Confirm, FolderNames, StylingTypes } from './config';
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

/**
 * Task to setup a configuration file.
 * Depending on the user's choice it will enable or disable auto creation of styling files
 * during component creation.
 *
 * @param {Answers} answers - Contains root directory and styling framework type.
 */
export const setupTask = (config: Config) => (answers: Answers) => {
  taskRunner(({ prettify }) => {
    const { root, stylingFramework } = answers;
    const configuration: Config = {
      ...config,
      root: root,
      ...(stylingFramework === StylingTypes.NONE
        ? { addStylingFileToComponent: false }
        : { stylingType: stylingFramework, addStylingFileToComponent: true }),
    };
    createFile(
      pathResolver(process.cwd(), '.ctf-config.json'),
      prettify(JSON.stringify(configuration), true),
      '.ctf-config.json'
    );
  });
};

/**
 * Task to initialize a projects directory structure.
 * It will create all directories the user has checked in the inquirer prompt.
 *
 * @param {Answers} answers - Contains specified folder names and whether or not to create index files.
 */
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

/**
 * Task to create TS files for a new component or hook.
 * It will review the parent and component directory, whether or not it is ready.
 * It will then create the appropriate folders and files.
 * And if an index file is located in the parent directory, it will add the component to it.
 *
 * @param {Answers} answers - Contains the type of the file (component or hook) and the name of the component,
 * as well as the directory and if not specified, whether or not to create a styling file.
 */
export const createTask = (config: Config) => (answers: Answers) => {
  taskRunner(({ prettify }) => {
    const { typeOfFile, fileName, fileDir, addStyleFile } = answers;
    const { parentDir, componentDir, indexPath, filePath } = generatePathValues(
      pathResolver(config.root, fileDir),
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
      config.addStylingFileToComponent || addStyleFile,
      config.stylingType,
      componentDir,
      prettify
    );
  });
};
