"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupQuestions = exports.initQuestions = exports.createQuestions = exports.entryQuestions = exports.defaultConfig = exports.FolderNames = exports.Confirm = exports.TypeOfAction = exports.TypeOfFile = exports.prettierConfig = void 0;
var utils_1 = require("./utils");
exports.prettierConfig = {
    trailingComma: 'es5',
    singleQuote: true,
    printWidth: 100,
    parser: 'typescript',
};
var TypeOfFile;
(function (TypeOfFile) {
    TypeOfFile["COMPONENT"] = "component";
    TypeOfFile["HOOK"] = "hook";
})(TypeOfFile = exports.TypeOfFile || (exports.TypeOfFile = {}));
var TypeOfAction;
(function (TypeOfAction) {
    TypeOfAction["SETUP"] = "Set up CTF configuration file";
    TypeOfAction["INIT"] = "Initialize (root) folder structure";
    TypeOfAction["CREATE"] = "Create files";
})(TypeOfAction = exports.TypeOfAction || (exports.TypeOfAction = {}));
var Confirm;
(function (Confirm) {
    Confirm["YES"] = "Yes";
    Confirm["NO"] = "No";
})(Confirm = exports.Confirm || (exports.Confirm = {}));
var FolderNames;
(function (FolderNames) {
    FolderNames["ADAPTERS"] = "adapters";
    FolderNames["COMPONENTS"] = "components";
    FolderNames["CONFIG"] = "config";
    FolderNames["HELPERS"] = "helpers";
    FolderNames["HOOKS"] = "hooks";
    FolderNames["PAGES"] = "pages";
})(FolderNames = exports.FolderNames || (exports.FolderNames = {}));
exports.defaultConfig = {
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
exports.entryQuestions = [
    {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [TypeOfAction.CREATE, TypeOfAction.INIT, TypeOfAction.SETUP],
    },
];
var createQuestions = function (config) { return [
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
        when: function (answers) { return answers.typeOfFile === TypeOfFile.COMPONENT; },
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
        default: function (answers) {
            var typeOfFile = answers.typeOfFile;
            if (typeOfFile === TypeOfFile.COMPONENT) {
                return (0, utils_1.pathResolver)(config.root, config.dirs.components);
            }
            if (typeOfFile === TypeOfFile.HOOK) {
                return (0, utils_1.pathResolver)(config.root, config.dirs.hooks);
            }
        },
    },
]; };
exports.createQuestions = createQuestions;
exports.initQuestions = [
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
exports.setupQuestions = [
    {
        type: 'input',
        name: 'root',
        message: 'What is the root of your application files? (typically you\'ll use "src" for create-react-app, and "" for Next.js)',
    },
];
