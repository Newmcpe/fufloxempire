export type LoadDbResponse = {
    data: {
        dbSkills: Array<DbSkill>;
    };
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

export type SkillsResponse = {
    data: Record<
        string,
        {
            level: number;
            lastUpgradeDate: string;
            finishUpgradeDate: string | null;
        }
    >;
};

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

export type HeroInfoResponse = {
    data: Hero;
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
    data: {
        fight: Fight;
        hero: Hero;
        opponent?: {
            name: string;
        };
    };
};
//{
//     "success": true,
//     "data": {
//         "id": 277588744,
//         "avatar": "/src/assets/img/heroes/avatar.png",
//         "firstName": "Алина",
//         "lastName": "",
//         "userName": "Newmcpe",
//         "isPremium": true,
//         "friends": 15,
//         "refCode": "hero277588744",
//         "registrationDate": "2024-07-20 19:44:44",
//         "photoUrl": null,
//         "isCanConnectFriend": true,
//         "isBetaTester": false,
//         "walletBalance": 0,
//         "notcoinTier": 1
//     }
// }
export type ProfileInfoResponse = {
    data: {
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
};
