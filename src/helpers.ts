import prettier from 'prettier';
import {
  Config,
  prettierConfig,
  TypeOfFile,
  defaultConfig,
  styleFileExtensions,
  StylingTypes,
} from './config';
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

/**
 * Will try to read the config file if found and return it with missing default values,
 * otherwise will return the default config.
 */
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

/**
 * Will try to read a prettier config file if found and return it,
 * otherwise it will return a default config.
 */
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

/**
 * Reviews the parent directory of the file the user wants to create,
 * it will fail if it doesn't exist.
 */
export const reviewParentDir = (parentDir: string) => {
  if (!doesPathExist(parentDir)) {
    throw new Error(`\n❌ The directory you specified does not exist. (at path ${parentDir})`);
  }
};

/**
 * Reviews the component directory,
 * in case of a component file, it will fail if the component already exists.
 */
export const reviewComponentDir = (componentDir: string, typeOfFile: TypeOfFile) => {
  if (typeOfFile === TypeOfFile.COMPONENT) {
    if (doesPathExist(componentDir)) {
      throw new Error(`\n❌ The file you specified already exist. (at path ${componentDir})`);
    }
  }
};

export const generateIndexPath = (path: string) => `${path}/index.ts`;
/**
 * If no name is specified, it'll ignore the first part of the file name
 * So if the extension is "style.css.ts" and the name is empty, it'll return only the extension.
 * If the name is "button" and the extension is "style.ts", it'll return "button.style.ts"
 */
export const generateStyleFileName = (name: string, ext: string) =>
  `${name}${name ? '.' : ''}${ext}`;
export const generateStylePath = (path: string, name: string, ext: string) =>
  `${path}/${generateStyleFileName(name, ext)}`;

/**
 * Generates all required path values for the TS file.
 * Returns an object with the following properties:
 * - **parentDir**: the path of the parent directory.
 * - **componentDir**: the path of the component directory.
 * - **filePath**: the path of the component file.
 * - **indexPath**: the path of the component index file.
 */
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

/**
 * Only for components, will create a directory for all future files to be placed in.
 */
export const createComponentDirectory = (componentDir: string, typeOfFile: TypeOfFile) => {
  if (typeOfFile === TypeOfFile.COMPONENT) {
    createDirectory(componentDir);
  }
};

const getStylingFileVars = (fileName: string, dir: string, ext: string) => {
  const lowerCasedName = fileName.charAt(0).toLowerCase() + fileName.slice(1);

  return {
    lowerCasedName,
    styleFilePath: generateStylePath(dir, lowerCasedName, ext),
  };
};

const createStylingFile = (
  styleFileExtension: Exclude<StylingTypes, StylingTypes.NONE>,
  fileName: string,
  componentDir: string,
  filePath: string,
  prettify: (text: string, json?: boolean | undefined) => string,
  componentWithStyling: (lowerCasedName: string, ext: string) => string
) => {
  const { lowerCasedName, styleFilePath } = getStylingFileVars(
    styleFileExtension === StylingTypes.CSS ? fileName : '',
    componentDir,
    styleFileExtensions[styleFileExtension]
  );
  createFile(
    filePath,
    prettify(
      componentWithStyling(
        lowerCasedName,
        styleFileExtensions[styleFileExtension].replace('.ts', '')
      )
    ),
    fileName
  );
  createFile(
    styleFilePath,
    '',
    generateStyleFileName(lowerCasedName, styleFileExtensions[styleFileExtension])
  );
};

export const createComponentFiles = (
  fileName: string,
  indexPath: string,
  filePath: string,
  typeOfFile: TypeOfFile,
  addStylingFile: boolean,
  styleFileExtension: Config['stylingType'] | undefined,
  componentDir: string,
  prettify: ReturnType<typeof buildPrettier>
) => {
  const { index, component, componentWithStyling, hook } = componentTemplates(fileName);

  switch (typeOfFile) {
    case TypeOfFile.COMPONENT:
      createFile(indexPath, prettify(index), 'index');

      if (addStylingFile && styleFileExtension && styleFileExtension !== StylingTypes.NONE) {
        createStylingFile(
          styleFileExtension,
          fileName,
          componentDir,
          filePath,
          prettify,
          componentWithStyling
        );
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

/**
 * This will add an export of the component to the index file of the parent folder if that file exists
 */
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
      // If the file content is just a basic empty export -> "export {};"
      // It'll be replaced with the component export
      if (fileContent.includes(entryTemplates.index) && fileContent.length <= 11) {
        updateFile(indexPath, parentIndex, fileName);
      } else {
        // If not, it'll be added to the end of the file
        const updatedContent = fileContent.endsWith('\n')
          ? `${fileContent.slice(0, -1)}\n${parentIndex}`
          : `${fileContent}\n${parentIndex}`;
        updateFile(indexPath, prettify(updatedContent), fileName);
      }
    }
    log('✅ Added import to parent index file');
  }
};
