import {
    getHeroInfo,
    getProfileInfo,
    loadDb,
    skills,
} from './musk-empire-api.js';
import { getPrice, getProfit } from '../../util/math.js';
import { SkillRequirement } from './model.js';

export type Upgrade = {
    id: string;
    isActive: boolean;
    currentLevel: number;
    profitCurrent: number;
    profitIncrement: number;
    isMaxLevel: boolean;
    isMaxLevelMore: boolean;
    isCanUpgraged: boolean;
    isPenultimateLevel: boolean;
    profitNextLevel: number;
    priceNextLevel: number;
    levels: SkillRequirement[];
};

export const getUpgrades = async (token: string): Promise<Upgrade[]> => {
    const {
        data: {
            data: { dbSkills },
        },
    } = await loadDb(token);
    const {
        data: { data: skillLevels },
    } = await skills(token);

    const {
        data: { data: heroInfo },
    } = await getHeroInfo(token);

    const {
        data: { data: profileInfo },
    } = await getProfileInfo(token);

    return dbSkills
        .filter((dbSkill) => dbSkill.key in skillLevels)
        .map((dbSkill) => {
            const currentLevel = skillLevels[dbSkill.key].level;
            const nextLevel = currentLevel + 1;

            const profitCurrent = getProfit(dbSkill, currentLevel);
            const profitNextLevel = getProfit(dbSkill, currentLevel + 1);
            const isMaxLevel = currentLevel >= dbSkill.maxLevel;

            const C = arrayByKey(dbSkill.levels, 'level');
            const d =
                !isMaxLevel && String(nextLevel) in C
                    ? C[String(nextLevel)]
                    : null;

            let p = !0;

            let v = !0;
            let b = !0;
            let n = !0;
            let D: Record<any, any> = {};

            d &&
                ((b = heroInfo.level >= d.requiredHeroLevel),
                (n = profileInfo.friends >= d.requiredFriends),
                isEmptyObject(d?.requiredSkills) ||
                    Object.entries(d?.requiredSkills!).forEach(([N, M]) => {
                        (!(N in skillLevels) || M > skillLevels[N].level) &&
                            ((p = !1), (D[N] = M));
                    }),
                (v = p && b && n));

            return {
                id: dbSkill.key,
                isActive: skillLevels[dbSkill.key].level > 0,
                currentLevel: currentLevel,
                isMaxLevel: isMaxLevel,
                isMaxLevelMore: currentLevel > dbSkill.maxLevel,
                isPenultimateLevel: currentLevel + 1 === dbSkill.maxLevel,
                levels: dbSkill.levels,
                profitNextLevel,
                profitCurrent,
                isCanUpgraged: v,
                priceNextLevel: getPrice(
                    dbSkill,
                    skillLevels[dbSkill.key].level + 1
                ),
                profitIncrement: profitNextLevel - profitCurrent,
            };
        });
};

function arrayByKey<T extends Record<string, any>>(
    arr: T[],
    key: keyof T
): Record<string, T> {
    return arr.reduce((acc: Record<string, T>, obj: T) => {
        acc[obj[key]] = obj;
        return acc;
    }, {});
}

// _isEmptyObject(e) {
//             return Object.keys(e).length === 0
//         },
function isEmptyObject(obj: any) {
    return Object.keys(obj).length === 0;
}
