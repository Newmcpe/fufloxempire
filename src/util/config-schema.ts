export type Config = {
    accounts: Record<string, MuskEmpireAccount>;
};

export type Proxy = {
    host: string;
    port: number;
    username: string;
    password: string;
};

export type MuskEmpireAccount = {
    clientName: string;
    currentCooldowns: Cooldowns;
    modules: string[];
    preferences: {
        minimalBalance: number;
        pvpMinimalBalance: {
            bronze: number;
            silver: number;
            gold: number;
            platina: number;
            diamond: number;
        };
    };
};

export type Cooldowns = {
    noUpgradesUntil: number;
    noOfflineBonusUntil: number;
    noPvpUntil: number;
    noTapsUntil: number;
};

export const defaultConfig: Config = {
    accounts: {},
};

export const defaultMuskEmpireAccount: MuskEmpireAccount = {
    clientName: '',
    currentCooldowns: {
        noUpgradesUntil: 0,
        noOfflineBonusUntil: 0,
        noPvpUntil: 0,
        noTapsUntil: 0,
    },
    preferences: {
        minimalBalance: 1000,
        pvpMinimalBalance: {
            bronze: 50000,
            silver: 500000,
            gold: 5000000,
            platina: 50000000,
            diamond: 500000000,
        },
    },
    modules: ['upgrader', 'offline-bonus-claimer', 'combater'],
};

export function mergeDeep(target: any, source: any) {
    for (const key of Object.keys(source)) {
        if (source[key] instanceof Object && key in target) {
            target[key] = mergeDeep(target[key], source[key]);
        } else if (!(key in target)) {
            target[key] = source[key];
        }
    }
    return target;
}
