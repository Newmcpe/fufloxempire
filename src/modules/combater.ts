function getRandomValue<T>(arr: T[]): T {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}

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

const log = Logger.create('[Combater]');

let loseStreak = 0;
const strategies = ['flexible', 'aggressive', 'protective'];

let strategy = strategies[1];

let wins = 0;
let losses = 0;
let income = 0;

export const combater = async (account: MuskEmpireAccount, apiKey: string) => {
    if (!isCooldownOver('noPvpUntil', account)) return;

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

    const { data } = await fightPvp(apiKey, league, strategy);
    if (!data.data) {
        console.log('No data found', data);
    }

    const muskResponse = data.data;
    if (!muskResponse.opponent) return;

    const { hero, opponent, fight } = muskResponse;

    const result = fight.winner === hero.id;

    if (!result) {
        income -= fight.moneyContract;

        losses++;
        loseStreak++;

        if (loseStreak >= 6) {
            await claimPvp(apiKey);
            strategy = getRandomValue(strategies.filter((s) => s !== strategy));

            loseStreak = 0;
            log.info(
                Logger.color(account.clientName, Color.Cyan),
                Logger.color('|', Color.Gray),
                `Обнаружен лузстрик`,
                `|`,
                `Сплю 30 секунд`,
                `|`,
                'Выбрана стратегия:',
                Logger.color(strategy, Color.Yellow)
            );
            setCooldown('noPvpUntil', account, 30);
            return;
        }
    } else {
        income += fight.moneyProfit;
        wins++;
        loseStreak = 0;
    }
    await claimPvp(apiKey);

    const winRate = (wins / (wins + losses)) * 100;

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
        Logger.color(strategy, Color.Yellow),
        `|`,
        'Доход:',
        income > 0
            ? Logger.color(`+${formatNumber(income)} 🪙`, Color.Green)
            : Logger.color(`${formatNumber(income)} 🪙`, Color.Red),
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
    const league = dbNegotiationsLeagues.find(
        (league) =>
            heroInfo.level >= league.requiredLevel &&
            heroInfo.level <= league.maxLevel &&
            heroInfo.money >=
                account.preferences.pvpMinimalBalance[
                    league.key as keyof typeof account.preferences.pvpMinimalBalance
                ]
    );

    if (!league) {
        log.error('League not found');
        return null;
    }

    return league.key;
};
