export type LoadDbResponse = {
  data: {
	dbSkills: Array<DbSkill>;
  };
}

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
  levels: Array<{
	level: number;
	title: string;
	requiredSkills: Array<any>;
	requiredHeroLevel: number;
	requiredFriends: number;
	desc: string;
  }>;
}

export type SkillsResponse = {
  data: Record<string, {
	level: number;
	lastUpgradeDate: string;
	finishUpgradeDate: string | null;
  }>;
}

//{
//     "success": true,
//     "data": {
//         "id": 277588744,
//         "level": 7,
//         "exp": 7051550,
//         "money": 298932,
//         "moneyUpdateDate": "2024-07-21 13:31:04",
//         "moneyPerHour": 466100,
//         "energyUpdateDate": "2024-07-21 13:31:45",
//         "tax": 20,
//         "pvpMatch": 48,
//         "pvpWin": 32,
//         "pvpLose": 16,
//         "earns": {
//             "task": {
//                 "moneyPerTap": 12,
//                 "limit": 7000,
//                 "energy": 7000,
//                 "recoveryPerSecond": 10
//             },
//             "sell": {
//                 "moneyPerTap": 9,
//                 "limit": 3000,
//                 "energy": 3000,
//                 "recoveryPerSecond": 10
//             }
//         },
//         "dailyRewardLastDate": "2024-07-21 03:21:04",
//         "dailyRewardLastIndex": 2,
//         "onboarding": [
//             "1",
//             "40",
//             "10180",
//             "20",
//             "10000",
//             "21",
//             "10340",
//             "80",
//             "10380",
//             "90",
//             "60",
//             "10020",
//             "51",
//             "30",
//             "70",
//             "10040",
//             "50",
//             "10160",
//             "10420",
//             "31"
//         ],
//         "updateDate": "2024-07-20 19:45:48.856377",
//         "userId": 277588744,
//         "offlineBonus": 5308
//     }
// }
export type HeroInfoResponse = {
  data: {
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
	offlineBonus: number;
  };
}