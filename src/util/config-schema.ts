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
};

export type Cooldowns = {
    noUpgradesUntil: number;
    noOfflineBonusUntil: number;
    noPvpUntil: number;
};

export const defaultConfig: Config = {
    accounts: {},
};

export const defaultMuskEmpireAccount = {
    clientName: '',
    currentCooldowns: {
        noUpgradesUntil: 0,
        noOfflineBonusUntil: 0,
        noPvpUntil: 0,
    },
    modules: ['upgrader', 'offline-bonus-claimer', 'combater'],
};
