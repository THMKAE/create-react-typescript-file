import inquirer from 'inquirer';
import { Config, createQuestions, initQuestions, setupQuestions } from './config';
import { createTask, initTask, setupTask } from './tasks';

export const createInquiry = (config: Config) => {
  inquirer.prompt(createQuestions(config)).then(createTask(config));
};

export const initInquiry = (config: Config) => {
  inquirer.prompt(initQuestions(config)).then(initTask(config));
};

export const setupInquiry = (config: Config) => {
  inquirer.prompt(setupQuestions).then(setupTask(config));
};
