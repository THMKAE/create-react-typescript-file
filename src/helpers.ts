import path from 'path';
import prettier from 'prettier';
import { Config, prettierConfig, TypeOfFile, defaultConfig } from './config';
import { componentTemplates } from './templates';
import { createDirectory, createFile, doesPathExist, log, pathResolver } from './utils';

export const getConfig = (): Config => {
  try {
    const projectConfig = require(path.resolve(process.cwd(), '.ctf-config.json'));
    log.i('\n🛠  Using local project configuration\n');
    return {
      ...defaultConfig,
      ...projectConfig,
      ...{ dirs: { ...defaultConfig.dirs, ...projectConfig.dirs } },
    };
  } catch (error) {
    log.i('\n🛠  Using default configuration\n');
    return defaultConfig;
  }
};

export const reviewParentDir = (parentDir: string) => {
  if (!doesPathExist(parentDir)) {
    log.e(`\n❌ The directory you specified does not exist. (at path ${parentDir})`, true);
  }
};

export const reviewComponentDir = (componentDir: string, typeOfFile: TypeOfFile) => {
  if (typeOfFile === TypeOfFile.COMPONENT) {
    if (doesPathExist(componentDir)) {
      log.e(`\n❌ The file you specified already exist. (at path ${componentDir})`, true);
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

export const buildPrettier = (json?: boolean) => {
  return (text: string) =>
    prettier.format(text, json ? { ...prettierConfig, parser: 'json' } : prettierConfig);
};

export const createComponentDirectory = (componentDir: string, typeOfFile: TypeOfFile) => {
  log.i('\n');
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
  componentDir: string
) => {
  const prettify = buildPrettier();
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

  log.i(`\n🎉 All done! Navigate to ${filePath} and start editing! 🎉`);
};
