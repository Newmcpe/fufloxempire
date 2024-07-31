import enquirer from 'enquirer';
import { JSONFileSyncPreset } from 'lowdb/node';
import { setupNewAccount } from './onboarding.js';
import {
    Config,
    defaultConfig,
    defaultMuskEmpireAccount,
    mergeDeep,
    MuskEmpireAccount,
} from './util/config-schema.js';
import { startHeartbeat } from 'modules/heartbeat.js';
import axios from 'axios';
import * as process from 'node:process';

export const storage = JSONFileSyncPreset<Config>(
    (process.env.CONFIG_PATH || '') + 'config.json',
    defaultConfig
);

storage.update((data) => {
    Object.entries(data.accounts).forEach(([key, account]) => {
        data.accounts[key] = mergeDeep(account, defaultMuskEmpireAccount);
    });
});

if (Object.keys(storage.data.accounts).length == 0) {
    await setupNewAccount(true);
}

const menuResponse = !!process.env.ACTION
    ? { action: process.env.ACTION }
    : await enquirer.prompt<{
          action: 'add' | 'run';
      }>({
          type: 'select',
          name: 'action',
          message: '📝 Запустить бота? ',
          initial: 0,
          choices: [
              {
                  name: 'run',
                  message: 'Запустить бота',
              },
              {
                  name: 'add',
                  message: 'Добавить новый аккаунт (Add a new account)',
              },
          ],
      });

switch (menuResponse.action) {
    case 'run':
        await startHeartbeat();
        break;
    case 'add':
        await setupNewAccount();
        break;
    default:
        throw new Error('Unknown action');
}
