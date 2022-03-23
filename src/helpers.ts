import prettier from 'prettier';
import { Config, prettierConfig, TypeOfFile, defaultConfig } from './config';
import { entryTemplates, componentTemplates } from './templates';
import {
  createDirectory,
  createFile,
  doesPathExist,
  getDirectoryFiles,
  log,
  pathResolver,
  readFile,
  updateFile,
} from './utils';

export const getConfig = (): Config => {
  try {
    const projectConfig = require(pathResolver(process.cwd(), '.ctf-config.json'));
    return {
      ...defaultConfig,
      ...projectConfig,
      ...{ dirs: { ...defaultConfig.dirs, ...projectConfig.dirs } },
    };
  } catch (error) {
    return defaultConfig;
  }
};

const getPrettierConfig = () => {
  try {
    const projectConfig: prettier.Options = require(pathResolver(
      process.cwd(),
      '.prettierrc.json'
    ));
    log('🛠  Using local prettier configuration');
    return {
      ...prettierConfig,
      ...projectConfig,
    };
  } catch (error) {
    log('🛠  Using default prettier configuration');
    return prettierConfig;
  }
};

export const buildPrettier = () => {
  const config: prettier.Options = getPrettierConfig();
  return (text: string, json?: boolean) =>
    prettier.format(text, json ? { ...config, parser: 'json' } : config);
};

export const reviewParentDir = (parentDir: string) => {
  if (!doesPathExist(parentDir)) {
    throw new Error(`\n❌ The directory you specified does not exist. (at path ${parentDir})`);
  }
};

export const reviewComponentDir = (componentDir: string, typeOfFile: TypeOfFile) => {
  if (typeOfFile === TypeOfFile.COMPONENT) {
    if (doesPathExist(componentDir)) {
      throw new Error(`\n❌ The file you specified already exist. (at path ${componentDir})`);
    }
  }
};

export const generateIndexPath = (path: string) => `${path}/index.ts`;
export const generateCSSModulesPath = (path: string, name: string) => `${path}/${name}.module.css`;

export const generatePathValues = (dir: string, name: string, typeOfFile: TypeOfFile) => {
  const parentDir = pathResolver(dir);
  const componentDir =
    typeOfFile === TypeOfFile.COMPONENT ? pathResolver(parentDir, name) : parentDir;
  const filePath = `${componentDir}/${name}.ts${typeOfFile === TypeOfFile.COMPONENT ? 'x' : ''}`;
  const indexPath = generateIndexPath(componentDir);

  return {
    parentDir,
    componentDir,
    filePath,
    indexPath,
  };
};

export const createComponentDirectory = (componentDir: string, typeOfFile: TypeOfFile) => {
  if (typeOfFile === TypeOfFile.COMPONENT) {
    createDirectory(componentDir);
  }
};

const getCSSModulesVars = (fileName: string, dir: string) => {
  const lowerCasedName = fileName.charAt(0).toLowerCase() + fileName.slice(1);

  return {
    lowerCasedName,
    CSSModulesPath: generateCSSModulesPath(dir, lowerCasedName),
  };
};

export const createComponentFiles = (
  fileName: string,
  indexPath: string,
  filePath: string,
  typeOfFile: TypeOfFile,
  addCssModuleStyling: boolean,
  componentDir: string,
  prettify: ReturnType<typeof buildPrettier>
) => {
  const { index, component, componentWithCSSModules, hook } = componentTemplates(fileName);

  switch (typeOfFile) {
    case TypeOfFile.COMPONENT:
      createFile(indexPath, prettify(index), 'index');

      if (addCssModuleStyling) {
        const { lowerCasedName, CSSModulesPath } = getCSSModulesVars(fileName, componentDir);
        createFile(filePath, prettify(componentWithCSSModules(lowerCasedName)), fileName);
        createFile(CSSModulesPath, '', `${lowerCasedName}.module.css`);
      } else {
        createFile(filePath, prettify(component), fileName);
      }
      break;

    case TypeOfFile.HOOK:
      createFile(filePath, prettify(hook), fileName);
      break;

    default:
      break;
  }

  log(`\n🎉 All done! Navigate to ${filePath} and start editing! 🎉`);
};

export const addToParentIndex = (
  parentDir: string,
  fileName: string,
  prettify: ReturnType<typeof buildPrettier>
) => {
  const files = getDirectoryFiles(parentDir);
  if (files?.includes('index.ts')) {
    const indexPath = pathResolver(parentDir, 'index.ts');
    const fileContent = readFile(indexPath);
    if (fileContent) {
      const { parentIndex } = componentTemplates(fileName);
      if (fileContent.includes(entryTemplates.index) && fileContent.length <= 11) {
        updateFile(indexPath, parentIndex, fileName);
      } else {
        const updatedContent = fileContent.endsWith('\n')
          ? `${fileContent.slice(0, -1)}\n${parentIndex}`
          : `${fileContent}\n${parentIndex}`;
        updateFile(indexPath, prettify(updatedContent), fileName);
      }
    }
    log('✅ Added import to parent index file');
  }
};
