import { MuskEmpireAccount } from '../util/config-schema.js';
import { getUpgrades, Upgrade } from '../api/muskempire/musk-empire-service.js';
import {
    getHeroInfo,
    getProfileInfo,
    improveSkill,
} from '../api/muskempire/musk-empire-api.js';
import { Color, Logger } from '@starkow/logger';
import { isCooldownOver, setCooldown } from './heartbeat.js';
import { formatNumber } from '../util/math.js';

const log = Logger.create('[Upgrader]');

export const upgrader = async (account: MuskEmpireAccount, apiKey: string) => {
    if (!isCooldownOver('noUpgradesUntil', account)) return;

    const upgrades = await getUpgrades(apiKey);
    const {
        data: { data: heroInfo },
    } = await getHeroInfo(apiKey);

    const bestUpgrade = upgrades
        .filter((upgrade) => {
            return (
                upgrade.isCanUpgraded &&
                !upgrade.isMaxLevel &&
                upgrade.priceNextLevel < 80000000
            );
        })
        .reduce(
            (best, upgrade) =>
                best === null ||
                upgrade.profitIncrement / upgrade.priceNextLevel >
                    best.profitIncrement / best.priceNextLevel
                    ? upgrade
                    : best,
            null as Upgrade | null
        );

    if (!bestUpgrade) {
        log.info(
            Logger.color(account.clientName, Color.Cyan),
            Logger.color(' | ', Color.Gray),
            `Нет доступных улучшений`
        );
        setCooldown('noUpgradesUntil', account, 600);
        return;
    }

    if (bestUpgrade.priceNextLevel > heroInfo.money) {
        log.info(
            Logger.color(account.clientName, Color.Cyan),
            Logger.color(' | ', Color.Gray),
            `Недостаточно денег для улучшения`,
            Logger.color(bestUpgrade.id, Color.Yellow),
            'Не хватает:',
            Logger.color(
                formatNumber(bestUpgrade.priceNextLevel - heroInfo.money),
                Color.Magenta
            )
        );
        setCooldown('noUpgradesUntil', account, 600);
        return;
    }

    if (
        heroInfo.money - bestUpgrade.priceNextLevel <
        account.preferences.minimalBalance
    ) {
        setCooldown('noUpgradesUntil', account, 600);
        return;
    }

    heroInfo.money -= bestUpgrade.priceNextLevel;

    await improveSkill(apiKey, bestUpgrade.id);

    log.info(
        Logger.color(account.clientName, Color.Cyan),
        Logger.color(' | ', Color.Gray),
        `Успешно улучшено`,
        Logger.color(bestUpgrade!.id, Color.Yellow),
        `с ценой`,
        Logger.color(bestUpgrade!.priceNextLevel.toString(), Color.Magenta),
        `до`,
        Logger.color((bestUpgrade!.currentLevel + 1).toString(), Color.Magenta),
        `уровня |\n`,
        `Заработок каждый час:`,
        Logger.color(
            formatNumber(bestUpgrade!.profitIncrement + heroInfo.moneyPerHour),
            Color.Magenta
        ),
        Logger.color(`(+${bestUpgrade!.profitIncrement})`, Color.Green),
        'Окупаемость:',
        Logger.color(
            formatNumber(
                bestUpgrade!.priceNextLevel / bestUpgrade!.profitIncrement
            ),
            Color.Magenta
        ),
        Logger.color(`часов`, Color.Green),
        `\n`,
        Logger.color(`Осталось денег:`, Color.Green),
        Logger.color(formatNumber(heroInfo.money), Color.Magenta)
    );

    setCooldown('noUpgradesUntil', account, 10);
};
