function getRandomValue<T>(arr: T[]): T {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}

import { MuskEmpireAccount } from '../util/config-schema.js';
import { Color, Logger } from '@starkow/logger';
import {
    claimPvp,
    fightPvp,
    getHeroInfo,
} from '../api/muskempire/musk-empire-api.js';
import { isCooldownOver, setCooldown } from './heartbeat.js';
import { formatNumber } from '../util/math.js';

const log = Logger.create('[Combater]');

let loseStreak = 0;
const strategies = ['flexible', 'aggressive', 'protective'];

let strategy = strategies[1];
let league = 'silver';

let wins = 0;
let losses = 0;
let income = 0;

export const combater = async (account: MuskEmpireAccount, apiKey: string) => {
    if (!isCooldownOver('noPvpUntil', account)) return;

    const {
        data: {
            data: { money },
        },
    } = await getHeroInfo(apiKey);

    if (money < account.preferences.minimalFightBalance) {
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

    setCooldown('noPvpUntil', account, 5);
};