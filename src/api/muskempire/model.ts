export type MuskEmpireResponse<T> = {
    data: T;
    success: boolean;
};

export type LoadDbResponse = {
    dbSkills: Array<DbSkill>;
    dbNegotiationsLeague: Array<DbNegotationLeague>;
};

export type DbNegotationLeague = {
    key: string;
    title: string;
    minContract: number;
    maxContract: number;
    img: string | null;
    dependenciesSkills: string[];
    requiredLevel: number;
    maxLevel: number;
    color: string;
    bgColor: string;
};

export type DbSkill = {
    key: string;
    title: string;
    category: string;
    subCategory: string;
    priceBasic: number;
    priceFormula: string;
    priceFormulaK: number;
    profitBasic: number;
    profitFormula: string;
    profitFormulaK: number;
    maxLevel: number;
    timeBasic: string;
    timeFormula: string;
    timeFormulaK: string;
    desc: string;
    special: string;
    levels: SkillRequirement[];
};

export type SkillRequirement = {
    level: number;
    title: string;
    requiredSkills: Record<string, number>;
    requiredHeroLevel: number;
    requiredFriends: number;
    desc: string;
};

export type SkillsResponse = Record<
    string,
    {
        level: number;
        lastUpgradeDate: string;
        finishUpgradeDate: string | null;
    }
>;

export type Hero = {
    id: number;
    level: number;
    exp: number;
    money: number;
    moneyUpdateDate: string;
    moneyPerHour: number;
    energyUpdateDate: string;
    tax: number;
    pvpMatch: number;
    pvpWin: number;
    pvpLose: number;
    earns: {
        task: {
            moneyPerTap: number;
            limit: number;
            energy: number;
            recoveryPerSecond: number;
            bonusChance: number;
            bonusMultiplier: number;
        };
        sell: {
            moneyPerTap: number;
            limit: number;
            energy: number;
            recoveryPerSecond: number;
        };
    };
    dailyRewardLastDate: string;
    dailyRewardLastIndex: number;
    onboarding: string[];
    updateDate: string;
    userId: number;
    offlineBonus?: number;
};
export type Fight = {
    id: string;
    league: string;
    moneyContract: number;
    moneyProfit: number;
    searchTime: number;
    player1: number;
    player1Strategy: string;
    player1Level: number;
    player1Rewarded: boolean;
    player2: number;
    player2Strategy: string;
    player2Rewarded: boolean;
    winner: number;
    draw: any[];
    updateDate: string;
    creationDate: string;
};

export type FightResponse = {
    fight: Fight;
    hero: Hero;
    opponent?: {
        name: string;
    };
};
export type ProfileInfoResponse = {
    id: number;
    avatar: string;
    firstName: string;
    lastName: string;
    userName: string;
    isPremium: boolean;
    friends: number;
    refCode: string;
    registrationDate: string;
    photoUrl: string;
    isCanConnectFriend: boolean;
    isBetaTester: boolean;
    walletBalance: number;
    notcoinTier: number;
};
