import enquirer from 'enquirer';
import { JSONFileSyncPreset } from 'lowdb/node';
import { setupNewAccount } from './onboarding.js';
import {
    Config,
    defaultConfig,
    defaultMuskEmpireAccount,
    MuskEmpireAccount,
} from './util/config-schema.js';
import { startHeartbeat } from 'modules/heartbeat.js';
import axios from 'axios';
import * as process from 'node:process';

export const storage = JSONFileSyncPreset<Config>(
    process.env.CONFIG_PATH + 'config.json',
    defaultConfig
);
// storage.update((data) => {
//     Object.entries(data.accounts).forEach(([key, account]) => {
//         Object.keys(defaultMuskEmpireAccount).forEach((defaultKey) => {
//             const keyOfAccount = defaultKey as keyof MuskEmpireAccount;
//
//             // Check if the current key is undefined in the account
//             if (account[keyOfAccount] === undefined) {
//                 // If undefined, assign the value from defaultMuskEmpireAccounts
//                 account[keyOfAccount] = defaultMuskEmpireAccount[
//                     keyOfAccount
//                 ] as any;
//             }
//         });
//         // Update the account in storage
//         data.accounts[key] = account;
//     });
// });

if (!storage.data.accounts) {
    await setupNewAccount(true);
}

axios.interceptors.response.use(
    function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        // console.log(response.data);
        return response;
    },
    function (error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        console.error(error);
        return Promise.resolve();
    }
);

const menuResponse = !!process.env.ACTION
    ? { action: process.env.ACTION }
    : await enquirer.prompt<{
          action: 'add' | 'run';
      }>({
          type: 'select',
          name: 'action',
          message: '📝 Запустить бота?',
          initial: 0,
          choices: [
              {
                  name: 'run',
                  message: 'Запустить бота',
              },
              {
                  name: 'add',
                  message: 'Добавить новый аккаунт',
              },
          ],
      });

switch (menuResponse.action) {
    case 'run':
        console.log('запуск бота');
        await startHeartbeat();
        break;
    case 'add':
        await setupNewAccount();
        break;
    default:
        throw new Error('Unknown action');
}
