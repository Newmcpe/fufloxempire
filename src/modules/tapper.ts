import { MuskEmpireAccount } from '../util/config-schema.js';
import { getHeroInfo, tap } from '../api/muskempire/musk-empire-api.js';
import { isCooldownOver, setCooldown } from './heartbeat.js';
import { Color, Logger } from '@starkow/logger';
import { formatNumber } from '../util/number.js';

const log = Logger.create('[Tapper]');

export const tapper = async (account: MuskEmpireAccount, apiKey: string) => {
    if (!isCooldownOver('noTapsUntil', account)) return;

    const {
        data: { data: heroInfo },
    } = await getHeroInfo(apiKey);

    const energy = heroInfo.earns.sell.energy;

    const taps = Math.floor(Math.random() * (energy - 500)) + 500;

    if (taps > 0) {
        const {
            data: { success },
            status,
        } = await tap(apiKey, taps, energy);

        if (success && status === 200) {
            log.info(
                Logger.color(account.clientName, Color.Cyan),
                Logger.color(' | ', Color.Gray),
                `Натапал на`,
                Logger.color(`+${formatNumber(taps)} 🪙`, Color.Green)
            );

            setCooldown(
                'noTapsUntil',
                account,
                1 + Math.floor(Math.random() * 5)
            );
        } else {
            log.info(
                Logger.color(account.clientName, Color.Cyan),
                Logger.color(' | ', Color.Gray),
                `Ушли в рейт лимит, слипаем 30 сек`
            );

            setCooldown('noTapsUntil', account, 30);
        }
    } else {
        log.info(
            Logger.color(account.clientName, Color.Cyan),
            Logger.color(' | ', Color.Gray),
            `Нет энергии для тапа`
        );
        setCooldown('noTapsUntil', account, 200);
    }
};
