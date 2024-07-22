import { MuskEmpireAccount } from '../util/config-schema.js';
import { Color, Logger } from '@starkow/logger';
import {
    claimPvp,
    fightPvp,
    getHeroInfo,
} from '../api/muskempire/musk-empire-api.js';
import { isCooldownOver, setCooldown } from './heartbeat.js';

const log = Logger.create('[Combater]');

let loseStreak = 0;
const strategies = ['flexible', 'aggressive', 'protective'];

let strategy = strategies[1];

let wins = 0;
let losses = 0;

export const combater = async (account: MuskEmpireAccount, apiKey: string) => {
    if (!isCooldownOver('noPvpUntil', account)) return;

    const {
        data: {
            data: { money },
        },
    } = await getHeroInfo(apiKey);

    if (money < 25000) {
        setCooldown('noPvpUntil', account, 30);
        return;
    }

    const {
        data: {
            data: { opponent, fight, hero },
        },
    } = await fightPvp(apiKey, 'bronze', strategy);

    if (!opponent) return;

    const result = fight.winner === hero.id;

    if (!result) {
        losses++;
        loseStreak++;

        if (loseStreak >= 4) {
            await claimPvp(apiKey);
            strategy =
                strategies[Math.floor(Math.random() * strategies.length)];

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
        wins++;
        loseStreak = 0;
    }
    await claimPvp(apiKey);

    log.info(
        Logger.color(account.clientName, Color.Cyan),
        Logger.color('|', Color.Gray),
        `Успешно проведена атака на`,
        Logger.color(opponent.name, Color.Magenta),
        `|`,
        `Стратегия врага:`,
        Logger.color(fight.player1Strategy, Color.Yellow),
        `|`,
        `Стратегия героя:`,
        Logger.color(strategy, Color.Yellow),
        `|`,
        'Результат:',
        result
            ? Logger.color('Победа', Color.Green)
            : Logger.color('Поражение', Color.Red),
        `|`,
        `Процент побед:`,
        Logger.color(
            ((wins / (wins + losses)) * 100).toFixed(2) + '%',
            Color.Yellow
        )
    );
};
