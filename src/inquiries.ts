import inquirer, { Answers } from 'inquirer';
import {
  Config,
  Confirm,
  createQuestions,
  FolderNames,
  initQuestions,
  setupQuestions,
} from './config';
import {
  createComponentDirectory,
  createComponentFiles,
  generatePathValues,
  getConfig,
  reviewComponentDir,
  reviewParentDir,
  generateIndexPath,
  buildPrettier,
} from './helpers';
import { entryTemplates } from './templates';
import { pathResolver, doesPathExist, createDirectory, createFile, log } from './utils';

export const createInquiry = () => {
  const config = getConfig();
  inquirer.prompt(createQuestions(config)).then((answers: Answers) => {
    const { typeOfFile, fileName, fileDir, addCssModule } = answers;
    const { parentDir, componentDir, indexPath, filePath } = generatePathValues(
      fileDir,
      fileName,
      typeOfFile
    );

    try {
      reviewParentDir(parentDir);
      reviewComponentDir(componentDir, typeOfFile);
      createComponentDirectory(componentDir, typeOfFile);
      createComponentFiles(
        fileName,
        indexPath,
        filePath,
        typeOfFile,
        config.addCSSModulesToComponent || addCssModule,
        componentDir
      );
    } catch (error) {
      log.e(`❌ ${error}`);
    } finally {
      process.exit(0);
    }
  });
};

export const initInquiry = () => {
  const config = getConfig();
  inquirer.prompt(initQuestions(config)).then((answers: Answers) => {
    try {
      const { folders, createIndexFiles } = answers;

      (folders as Array<FolderNames>).forEach((folder) => {
        const folderPath = pathResolver(config.root, config.dirs[folder]);
        if (!doesPathExist(folderPath)) {
          createDirectory(folderPath);
          if (config.addIndexFileToRootFolders || createIndexFiles === Confirm.YES) {
            createFile(generateIndexPath(folderPath), entryTemplates.index, 'index.ts');
            console.info('\n');
          }
        }
      });
    } catch (error) {
      log.e(`❌ ${error}`);
    } finally {
      process.exit(0);
    }
  });
};

export const setupInquiry = () => {
  inquirer.prompt(setupQuestions).then((answers: Answers) => {
    try {
      const { root } = answers;
      const prettify = buildPrettier(true);
      const config = getConfig();
      const configuration: Config = { ...config, root: root };
      createFile(
        pathResolver(process.cwd(), '.ctf-config.json'),
        prettify(JSON.stringify(configuration)),
        '.ctf-config.json'
      );
    } catch (error) {
      log.e(`❌ ${error}`);
    } finally {
      process.exit(0);
    }
  });
};
