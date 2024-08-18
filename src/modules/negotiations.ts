import { MuskEmpireAccount } from '../util/config.js';
import { Color, Logger } from '@starkow/logger';
import {
    claimPvp,
    fightPvp,
    getHeroInfo,
    loadDb,
} from '../api/muskempire/musk-empire-api.js';
import { isCooldownOver, setCooldown } from '../heartbeat.js';
import { formatNumber } from '../util/math.js';
import { DbNegotationLeague, Hero } from '../api/muskempire/model.js';

const log = Logger.create('[Negotiations]');

enum Strategy {
    aggressive = 'aggressive',
    protective = 'protective',
    flexible = 'flexible',
}

let selectedStrategy = Strategy.aggressive;

let wins: Record<string, number> = {};
let losses: Record<string, number> = {};
let income: Record<string, number> = {};
let loseStreak: Record<string, number> = {};

export const negotiations = async (
    account: MuskEmpireAccount,
    apiKey: string
) => {
    if (!isCooldownOver('noPvpUntil', account)) return;

    wins[account.clientName] = wins[account.clientName] || 0;
    losses[account.clientName] = losses[account.clientName] || 0;
    income[account.clientName] = income[account.clientName] || 0;
    loseStreak[account.clientName] = loseStreak[account.clientName] || 0;

    const {
        data: { data: heroInfo },
    } = await getHeroInfo(apiKey);

    if (heroInfo.money < account.preferences.minimalBalance) {
        setCooldown('noPvpUntil', account, 30);
        return;
    }

    const {
        data: {
            data: { dbNegotiationsLeague },
        },
    } = await loadDb(apiKey);

    const league = findLeague(account, heroInfo, dbNegotiationsLeague);

    if (!league) {
        setCooldown('noPvpUntil', account, 30);
        return;
    }

    const { data } = await fightPvp(apiKey, league, selectedStrategy);

    if (!data.success) {
        log.error(account.clientName, '|', 'ratelimited in negotiations');
        setCooldown('noPvpUntil', account, 300);
        return;
    }

    const muskResponse = data.data;
    if (!muskResponse.opponent) return;

    const { hero, opponent, fight } = muskResponse;
    const result = fight.winner === hero.id;

    if (!result) {
        income[account.clientName] -= fight.moneyContract;

        losses[account.clientName]++;
        loseStreak[account.clientName]++;

        if (loseStreak[account.clientName] >= 5) {
            roundStrategy();
            await claimPvp(apiKey);
            log.info(
                Logger.color(account.clientName, Color.Cyan),
                Logger.color('|', Color.Gray),
                `Обнаружен лузстрик`,
                `|`,
                `Сплю 30 секунд`,
                `|`,
                'Выбрана стратегия:',
                Logger.color(selectedStrategy, Color.Yellow)
            );
            setCooldown('noPvpUntil', account, 30);
            return;
        }
    } else {
        income[account.clientName] += fight.moneyProfit;
        wins[account.clientName]++;
        loseStreak[account.clientName] = 0;
    }

    await claimPvp(apiKey);

    const totalFights = wins[account.clientName] + losses[account.clientName];
    const winRate = (wins[account.clientName] / totalFights) * 100;

    log.info(
        Logger.color(account.clientName, Color.Cyan),
        Logger.color('|', Color.Gray),
        `Проведена атака на`,
        Logger.color(opponent.name, Color.Magenta),
        `|`,
        `Лига:`,
        Logger.color(league, Color.Yellow),
        `|`,
        `Стратегия врага:`,
        Logger.color(fight.player1Strategy, Color.Yellow),
        `|`,
        `Стратегия героя:`,
        Logger.color(selectedStrategy, Color.Yellow),
        `|`,
        'Доход:',
        income[account.clientName] > 0
            ? Logger.color(
                  `+${formatNumber(income[account.clientName])} 🪙`,
                  Color.Green
              )
            : Logger.color(
                  `${formatNumber(income[account.clientName])} 🪙`,
                  Color.Red
              ),
        `|`,
        'Результат:',
        result
            ? Logger.color('Победа', Color.Green)
            : Logger.color('Поражение', Color.Red),
        `|`,
        `Процент побед:`,
        Logger.color(winRate.toFixed(2) + '%', Color.Yellow)
    );

    setCooldown('noPvpUntil', account, 10);
};

const findLeague = (
    account: MuskEmpireAccount,
    heroInfo: Hero,
    dbNegotiationsLeagues: DbNegotationLeague[]
) => {
    const league = dbNegotiationsLeagues
        .slice()
        .reverse()
        .find(
            (league) =>
                heroInfo.level >= league.requiredLevel &&
                heroInfo.level <= league.maxLevel &&
                heroInfo.money >=
                    account.preferences.pvpMinimalBalance[
                        league.key as keyof typeof account.preferences.pvpMinimalBalance
                    ]
        );

    if (!league) {
        log.error(account.clientName, 'Не найдена подходящая лига');
        return null;
    }

    return league.key;
};

function roundStrategy() {
    switch (selectedStrategy) {
        case Strategy.aggressive:
            selectedStrategy = Strategy.protective;
            break;
        case Strategy.protective:
            selectedStrategy = Strategy.flexible;
            break;
        case Strategy.flexible:
            selectedStrategy = Strategy.aggressive;
            break;
    }
}
