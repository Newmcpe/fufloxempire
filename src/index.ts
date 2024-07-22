import enquirer from 'enquirer';
import { JSONFileSyncPreset } from 'lowdb/node';
import { setupNewAccount } from './onboarding.js';
import { Config, defaultConfig } from './util/config-schema.js';
import { startHeartbeat } from 'modules/heartbeat.js';
import axios from 'axios';
import * as process from 'node:process';

console.log(process.env.ACTION);
export const storage = JSONFileSyncPreset<Config>('config.json', defaultConfig);
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
        await startHeartbeat();
        break;
    case 'add':
        await setupNewAccount();
        break;
    default:
        throw new Error('Unknown action');
}
