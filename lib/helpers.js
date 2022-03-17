"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createComponentFiles = exports.createComponentDirectory = exports.buildPrettier = exports.generatePathValues = exports.generateCSSModulesPath = exports.generateIndexPath = exports.reviewComponentDir = exports.reviewParentDir = exports.getConfig = void 0;
var path_1 = __importDefault(require("path"));
var prettier_1 = __importDefault(require("prettier"));
var config_1 = require("./config");
var templates_1 = require("./templates");
var utils_1 = require("./utils");
var getConfig = function () {
    try {
        var projectConfig = require(path_1.default.resolve(process.cwd(), '.ctf-config.json'));
        utils_1.log.i('\n🛠  Using local project configuration\n');
        return __assign(__assign(__assign({}, config_1.defaultConfig), projectConfig), { dirs: __assign(__assign({}, config_1.defaultConfig.dirs), projectConfig.dirs) });
    }
    catch (error) {
        utils_1.log.i('\n🛠  Using default configuration\n');
        return config_1.defaultConfig;
    }
};
exports.getConfig = getConfig;
var reviewParentDir = function (parentDir) {
    if (!(0, utils_1.doesPathExist)(parentDir)) {
        utils_1.log.e("\n\u274C The directory you specified does not exist. (at path ".concat(parentDir, ")"), true);
    }
};
exports.reviewParentDir = reviewParentDir;
var reviewComponentDir = function (componentDir, typeOfFile) {
    if (typeOfFile === config_1.TypeOfFile.COMPONENT) {
        if ((0, utils_1.doesPathExist)(componentDir)) {
            utils_1.log.e("\n\u274C The file you specified already exist. (at path ".concat(componentDir, ")"), true);
        }
    }
};
exports.reviewComponentDir = reviewComponentDir;
var generateIndexPath = function (path) { return "".concat(path, "/index.ts"); };
exports.generateIndexPath = generateIndexPath;
var generateCSSModulesPath = function (path, name) { return "".concat(path, "/").concat(name, ".module.css"); };
exports.generateCSSModulesPath = generateCSSModulesPath;
var generatePathValues = function (dir, name, typeOfFile) {
    var parentDir = (0, utils_1.pathResolver)(dir);
    var componentDir = typeOfFile === config_1.TypeOfFile.COMPONENT ? (0, utils_1.pathResolver)(parentDir, name) : parentDir;
    var filePath = "".concat(componentDir, "/").concat(name, ".ts").concat(typeOfFile === config_1.TypeOfFile.COMPONENT ? 'x' : '');
    var indexPath = (0, exports.generateIndexPath)(componentDir);
    return {
        parentDir: parentDir,
        componentDir: componentDir,
        filePath: filePath,
        indexPath: indexPath,
    };
};
exports.generatePathValues = generatePathValues;
var buildPrettier = function (json) {
    return function (text) {
        return prettier_1.default.format(text, json ? __assign(__assign({}, config_1.prettierConfig), { parser: 'json' }) : config_1.prettierConfig);
    };
};
exports.buildPrettier = buildPrettier;
var createComponentDirectory = function (componentDir, typeOfFile) {
    utils_1.log.i('\n');
    if (typeOfFile === config_1.TypeOfFile.COMPONENT) {
        (0, utils_1.createDirectory)(componentDir);
    }
};
exports.createComponentDirectory = createComponentDirectory;
var getCSSModulesVars = function (fileName, dir) {
    var lowerCasedName = fileName.charAt(0).toLowerCase() + fileName.slice(1);
    return {
        lowerCasedName: lowerCasedName,
        CSSModulesPath: (0, exports.generateCSSModulesPath)(dir, lowerCasedName),
    };
};
var createComponentFiles = function (fileName, indexPath, filePath, typeOfFile, addCssModuleStyling, componentDir) {
    var prettify = (0, exports.buildPrettier)();
    var _a = (0, templates_1.componentTemplates)(fileName), index = _a.index, component = _a.component, componentWithCSSModules = _a.componentWithCSSModules, hook = _a.hook;
    switch (typeOfFile) {
        case config_1.TypeOfFile.COMPONENT:
            (0, utils_1.createFile)(indexPath, prettify(index), 'index');
            if (addCssModuleStyling) {
                var _b = getCSSModulesVars(fileName, componentDir), lowerCasedName = _b.lowerCasedName, CSSModulesPath = _b.CSSModulesPath;
                (0, utils_1.createFile)(filePath, prettify(componentWithCSSModules(lowerCasedName)), fileName);
                (0, utils_1.createFile)(CSSModulesPath, '', "".concat(lowerCasedName, ".module.css"));
            }
            else {
                (0, utils_1.createFile)(filePath, prettify(component), fileName);
            }
            break;
        case config_1.TypeOfFile.HOOK:
            (0, utils_1.createFile)(filePath, prettify(hook), fileName);
            break;
        default:
            break;
    }
    utils_1.log.i("\n\uD83C\uDF89 All done! Navigate to ".concat(filePath, " and start editing! \uD83C\uDF89"));
};
exports.createComponentFiles = createComponentFiles;
