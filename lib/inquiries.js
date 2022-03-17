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
exports.setupInquiry = exports.initInquiry = exports.createInquiry = void 0;
var inquirer_1 = __importDefault(require("inquirer"));
var config_1 = require("./config");
var helpers_1 = require("./helpers");
var templates_1 = require("./templates");
var utils_1 = require("./utils");
var createInquiry = function () {
    inquirer_1.default.prompt((0, config_1.createQuestions)((0, helpers_1.getConfig)())).then(function (answers) {
        var typeOfFile = answers.typeOfFile, fileName = answers.fileName, fileDir = answers.fileDir, addCssModule = answers.addCssModule;
        var _a = (0, helpers_1.generatePathValues)(fileDir, fileName, typeOfFile), parentDir = _a.parentDir, componentDir = _a.componentDir, indexPath = _a.indexPath, filePath = _a.filePath;
        try {
            (0, helpers_1.reviewParentDir)(parentDir);
            (0, helpers_1.reviewComponentDir)(componentDir, typeOfFile);
            (0, helpers_1.createComponentDirectory)(componentDir, typeOfFile);
            (0, helpers_1.createComponentFiles)(fileName, indexPath, filePath, typeOfFile, addCssModule, componentDir);
        }
        catch (error) {
            utils_1.log.e("\u274C ".concat(error));
        }
        finally {
            process.exit(0);
        }
    });
};
exports.createInquiry = createInquiry;
var initInquiry = function () {
    inquirer_1.default.prompt(config_1.initQuestions).then(function (answers) {
        try {
            var folders = answers.folders, createIndexFiles_1 = answers.createIndexFiles;
            var config_2 = (0, helpers_1.getConfig)();
            folders.forEach(function (folder) {
                var folderPath = (0, utils_1.pathResolver)(config_2.root, config_2.dirs[folder]);
                if (!(0, utils_1.doesPathExist)(folderPath)) {
                    (0, utils_1.createDirectory)(folderPath);
                    if (createIndexFiles_1 === config_1.Confirm.YES) {
                        (0, utils_1.createFile)((0, helpers_1.generateIndexPath)(folderPath), templates_1.entryTemplates.index, 'index.ts');
                        console.info('\n');
                    }
                }
            });
        }
        catch (error) {
            utils_1.log.e("\u274C ".concat(error));
        }
        finally {
            process.exit(0);
        }
    });
};
exports.initInquiry = initInquiry;
var setupInquiry = function () {
    inquirer_1.default.prompt(config_1.setupQuestions).then(function (answers) {
        try {
            var prettify = (0, helpers_1.buildPrettier)(true);
            var root = answers.root;
            var config = (0, helpers_1.getConfig)();
            var configuration = __assign(__assign({}, config), { root: root });
            (0, utils_1.createFile)((0, utils_1.pathResolver)(process.cwd(), '.ctf-config.json'), prettify(JSON.stringify(configuration)), '.ctf-config.json');
        }
        catch (error) {
            utils_1.log.e("\u274C ".concat(error));
        }
        finally {
            process.exit(0);
        }
    });
};
exports.setupInquiry = setupInquiry;
