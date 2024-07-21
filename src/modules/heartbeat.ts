import {storage} from '../index.js';
import {MuskEmpireAccount} from '../util/config-schema.js';
import {dateNowInSeconds} from '../util/date.js';
import {Color, Logger} from '@starkow/logger';
import {createTelegramClient, getMuskEmpireApiKey} from "../onboarding.js";
import {authByTelegramWebApp} from "../api/muskempire/musk-empire-api.js";
import {upgrader} from "./upgrader.js";
import {offlineBonusClaimer} from "./offline-bonus-claimer.js";

const log = Logger.create('[HEARTBEAT]');

export async function startHeartbeat() {
  for (const account of Object.values(storage.data.accounts)) {

	const authData = await getMuskEmpireApiKey(account.clientName);

	await authByTelegramWebApp({
	  data: {
		initData: authData.initData,
		platform: 'android',
		chatId: '',
		chatType: 'sender',
		chatInstance: '-8493099482055851733',
	  },
	}, null)

	await accountHeartbeat(account, authData.apiKey);
  }
}

async function accountHeartbeat(account: MuskEmpireAccount, apiKey: string) {
  try {
	await offlineBonusClaimer(account, apiKey);
	await upgrader(account, apiKey)
  } catch (e) {
	log.error(
	  Logger.color(account.clientName, Color.Cyan),
	  Logger.color('|', Color.Gray),
	  'Ошибка при обновлении аккаунта:',
	  e
	);

	apiKey = (await getMuskEmpireApiKey(account.clientName)).apiKey;
  } finally {
	setTimeout(accountHeartbeat, 1000, account, apiKey);
  }
}

export function isCooldownOver(
  cooldown: keyof MuskEmpireAccount['currentCooldowns'],
  account: MuskEmpireAccount
): boolean {
  return account.currentCooldowns[cooldown] <= dateNowInSeconds();
}

export function setCooldown(
  cooldown: keyof MuskEmpireAccount['currentCooldowns'],
  account: MuskEmpireAccount,
  time: number
) {
  storage.update((data) => {
	data.accounts[account.clientName].currentCooldowns[cooldown] =
	  dateNowInSeconds() + time;
  });
}
