import { MuskEmpireAccount } from '../util/config-schema.js';
import { Color, Logger } from '@starkow/logger';
import {
    claimOfflineBonus,
    getHeroInfo,
} from '../api/muskempire/musk-empire-api.js';
import { isCooldownOver, setCooldown } from './heartbeat.js';
import { formatNumber } from '../util/number.js';

const log = Logger.create('[Offline Bonus Claimer]');

export const offlineBonusClaimer = async (
    account: MuskEmpireAccount,
    apiKey: string
) => {
    if (!isCooldownOver('noOfflineBonusUntil', account)) return;

    const {
        data: { data: heroInfo },
    } = await getHeroInfo(apiKey);

    if (heroInfo.offlineBonus || 0 > 0) {
        await claimOfflineBonus(apiKey);
        log.info(
            Logger.color(account.clientName, Color.Cyan),
            Logger.color(' | ', Color.Gray),
            `Собран оффлайн доход`,
            Logger.color(
                `+${formatNumber(heroInfo.offlineBonus!)} 🪙`,
                Color.Green
            )
        );
    }

    setCooldown('noOfflineBonusUntil', account, 60);
};
