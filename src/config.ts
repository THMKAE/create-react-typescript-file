import { Options } from 'prettier';
import { Answers, QuestionCollection } from 'inquirer';
import { pathResolver } from './utils';

export const prettierConfig: Options = {
  trailingComma: 'es5',
  singleQuote: true,
  printWidth: 100,
  parser: 'typescript',
};

export enum TypeOfFile {
  COMPONENT = 'component',
  HOOK = 'hook',
}

export enum TypeOfAction {
  SETUP = 'Set up CTF configuration file',
  INIT = 'Initialize (root) folder structure',
  CREATE = 'Create files',
}

export enum Confirm {
  YES = 'Yes',
  NO = 'No',
}

export enum FolderNames {
  ADAPTERS = 'adapters',
  COMPONENTS = 'components',
  CONFIG = 'config',
  HELPERS = 'helpers',
  HOOKS = 'hooks',
  PAGES = 'pages',
}

type Dirs = {
  dirs: { [key in FolderNames]: string };
};

export type Config = { root: string } & Dirs;

export const defaultConfig: Config = {
  root: 'src',
  dirs: {
    components: 'components',
    hooks: 'hooks',
    adapters: 'adapters',
    config: 'config',
    pages: 'pages',
    helpers: 'helpers',
  },
};

export const entryQuestions: QuestionCollection = [
  {
    type: 'list',
    name: 'action',
    message: 'What would you like to do?',
    choices: [TypeOfAction.CREATE, TypeOfAction.INIT, TypeOfAction.SETUP],
  },
];

export const createQuestions = (config: Config): QuestionCollection => [
  {
    type: 'list',
    name: 'typeOfFile',
    message: 'What type of React file would you like to create?',
    choices: [TypeOfFile.COMPONENT, TypeOfFile.HOOK],
  },
  {
    type: 'list',
    name: 'addCssModule',
    message: 'Want to add a (CSS modules) style file?',
    choices: [Confirm.YES, Confirm.NO],
    when: (answers: Answers) => answers.typeOfFile === TypeOfFile.COMPONENT,
  },
  {
    type: 'input',
    name: 'fileName',
    message: 'What is the file name?',
  },
  {
    type: 'input',
    name: 'fileDir',
    message: 'What is the path directory of the file?',
    default: (answers: Answers) => {
      const { typeOfFile } = answers;
      if (typeOfFile === TypeOfFile.COMPONENT) {
        return pathResolver(config.root, config.dirs.components);
      }
      if (typeOfFile === TypeOfFile.HOOK) {
        return pathResolver(config.root, config.dirs.hooks);
      }
    },
  },
];

export const initQuestions: QuestionCollection = [
  {
    type: 'checkbox',
    name: 'folders',
    message: 'Which folders should be initialized?',
    choices: [
      FolderNames.COMPONENTS,
      FolderNames.HOOKS,
      FolderNames.CONFIG,
      FolderNames.ADAPTERS,
      FolderNames.HELPERS,
      FolderNames.PAGES,
    ],
  },
  {
    type: 'list',
    name: 'createIndexFiles',
    message: 'Do you want to create index files per folder?',
    choices: [Confirm.YES, Confirm.NO],
  },
];

export const setupQuestions: QuestionCollection = [
  {
    type: 'input',
    name: 'root',
    message:
      'What is the root of your application files? (typically you\'ll use "src" for create-react-app, and "" for Next.js)',
  },
];
