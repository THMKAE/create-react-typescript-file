#!/usr/bin/env node

import { Command } from 'commander';
import inquirer, { Answers } from 'inquirer';
// @ts-ignore
import { version } from '../package.json';
import { entryQuestions, TypeOfAction } from './config';
import { getConfig } from './helpers';
import { createInquiry, initInquiry, setupInquiry } from './inquiries';

const program = new Command();

program
  .version(version)
  .description('Create a React TypeScript file')
  .action(() => {
    inquirer.prompt(entryQuestions).then((answers: Answers) => {
      const { action } = answers;
      const config = getConfig();

      if (action === TypeOfAction.SETUP) {
        setupInquiry(config);
      }
      if (action === TypeOfAction.INIT) {
        initInquiry(config);
      }
      if (action === TypeOfAction.CREATE) {
        createInquiry(config);
      }
    });
  });

program.parse();
