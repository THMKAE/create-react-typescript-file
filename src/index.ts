#!/usr/bin/env node

import { Command } from 'commander';
import inquirer, { Answers } from 'inquirer';
// @ts-ignore
import { version } from '../package.json';
import { entryQuestions, TypeOfAction } from './config';
import { createInquiry, initInquiry, setupInquiry } from './inquiries';

const program = new Command();

program
  .version(version)
  .description('Create a React TypeScript file')
  .action(() => {
    inquirer.prompt(entryQuestions).then((answers: Answers) => {
      const { action } = answers;

      if (action === TypeOfAction.SETUP) {
        setupInquiry();
      }
      if (action === TypeOfAction.INIT) {
        initInquiry();
      }
      if (action === TypeOfAction.CREATE) {
        createInquiry();
      }
    });
  });

program.parse();
