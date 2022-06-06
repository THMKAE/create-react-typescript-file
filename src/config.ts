import { Options } from 'prettier';
import { Answers, QuestionCollection } from 'inquirer';

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
  TYPES = 'types',
}

export enum StylingTypes {
  CSS = 'CSS-modules',
  SC = 'styled-components',
  VE = 'vanilla-extract',
  NONE = 'none',
}

type Dirs = {
  dirs: { [key in FolderNames]: string };
};

export type Config = {
  root: string;
  addIndexFileToRootFolders?: boolean;
  addStylingFileToComponent?: boolean;
  stylingType?: StylingTypes;
} & Dirs;

export const styleFileExtensions = {
  'CSS-modules': '.module.css',
  'styled-components': 'style.ts',
  'vanilla-extract': 'style.css.ts',
};

export const defaultConfig: Config = {
  root: 'src',
  dirs: {
    components: FolderNames.COMPONENTS,
    hooks: FolderNames.HOOKS,
    adapters: FolderNames.ADAPTERS,
    config: FolderNames.CONFIG,
    pages: FolderNames.PAGES,
    helpers: FolderNames.HELPERS,
    types: FolderNames.TYPES,
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
    name: 'addStyleFile',
    message: 'Want to add a style file?',
    choices: [Confirm.YES, Confirm.NO],
    when: (answers: Answers) =>
      answers.typeOfFile === TypeOfFile.COMPONENT && config.addStylingFileToComponent === undefined,
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
        return config.dirs.components;
      }
      if (typeOfFile === TypeOfFile.HOOK) {
        return config.dirs.hooks;
      }
    },
  },
];

export const initQuestions = (config: Config): QuestionCollection => [
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
    when: () => config.addIndexFileToRootFolders === undefined,
  },
];

export const setupQuestions: QuestionCollection = [
  {
    type: 'input',
    name: 'root',
    message:
      'What is the root of your application files? (typically you\'ll use "src" for create-react-app, and "" for Next.js)',
  },
  {
    type: 'list',
    name: 'stylingFramework',
    message: 'What type of styling framework are you using?',
    choices: [StylingTypes.CSS, StylingTypes.SC, StylingTypes.VE, StylingTypes.NONE],
  },
];
