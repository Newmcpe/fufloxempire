import {
    getHeroInfo,
    getProfileInfo,
    loadDb,
    skills,
} from './musk-empire-api.js';
import { getPrice, getProfit } from '../../util/math.js';
import { DbSkill, SkillRequirement, SkillsResponse } from './model.js';

export type Upgrade = {
    id: string;
    isActive: boolean;
    currentLevel: number;
    profitCurrent: number;
    profitIncrement: number;
    isMaxLevel: boolean;
    isMaxLevelMore: boolean;
    isCanUpgraded: boolean;
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

            const skillRequirements = arrayByKey(dbSkill.levels, 'level');
            const skillRequirement =
                !isMaxLevel && String(nextLevel) in skillRequirements
                    ? skillRequirements[String(nextLevel)]
                    : null;

            const isCooldownOver = checkCooldown(dbSkill, skillLevels);

            let isRequiredSkillsLevelsSufficient = !0;
            let isCanUpgraded = !0;
            let isLevelSufficient = !0;
            let isFriendsSufficient = !0;
            let D: Record<any, any> = {};

            skillRequirement &&
                ((isLevelSufficient =
                    heroInfo.level >= skillRequirement.requiredHeroLevel),
                (isFriendsSufficient =
                    profileInfo.friends >= skillRequirement.requiredFriends),
                isEmptyObject(skillRequirement?.requiredSkills) ||
                    Object.entries(skillRequirement?.requiredSkills!).forEach(
                        ([N, M]) => {
                            (!(N in skillLevels) || M > skillLevels[N].level) &&
                                ((isRequiredSkillsLevelsSufficient = !1),
                                (D[N] = M));
                        }
                    ),
                (isCanUpgraded =
                    isRequiredSkillsLevelsSufficient &&
                    isLevelSufficient &&
                    isCooldownOver &&
                    isFriendsSufficient));

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
                isCanUpgraded,
                priceNextLevel: getPrice(
                    dbSkill,
                    skillLevels[dbSkill.key].level + 1
                ),
                profitIncrement: profitNextLevel - profitCurrent,
            };
        });
};

function checkCooldown(dbSkill: DbSkill, skillLevels: SkillsResponse) {
    // if (!t.finishUpgradeDate || !t.lastUpgradeDate) return;
    const skillInfo = skillLevels[dbSkill.key];
    if (!skillInfo.finishUpgradeDate || !skillInfo.lastUpgradeDate) {
        return true;
    }

    const finishUpgradeDate = new Date(skillInfo.finishUpgradeDate);
    const lastUpgradeDate = new Date(skillInfo.lastUpgradeDate);

    const now = new Date();

    return now > finishUpgradeDate || now > lastUpgradeDate;
}

function arrayByKey<T extends Record<string, any>>(
    arr: T[],
    key: keyof T
): Record<string, T> {
    return arr.reduce((acc: Record<string, T>, obj: T) => {
        acc[obj[key]] = obj;
        return acc;
    }, {});
}

function isEmptyObject(obj: any) {
    return Object.keys(obj).length === 0;
}
