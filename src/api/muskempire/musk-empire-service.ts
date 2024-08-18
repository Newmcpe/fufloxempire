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
        .filter((dbSkill) => skillLevels.hasOwnProperty(dbSkill.key))
        .map((dbSkill) => {
            const currentLevel = skillLevels[dbSkill.key].level;
            const nextLevel = currentLevel + 1;
            const isMaxLevel = currentLevel >= dbSkill.maxLevel;

            const profitCurrent = getProfit(dbSkill, currentLevel);
            const profitNextLevel = getProfit(dbSkill, nextLevel);

            const skillRequirements = arrayByKey(dbSkill.levels, 'level');
            const skillRequirement = !isMaxLevel
                ? skillRequirements[nextLevel]
                : null;

            const isCooldownOver = checkCooldown(dbSkill, skillLevels);

            let isCanUpgraded = true;
            let missingRequirements: Record<string, number> = {};

            if (skillRequirement) {
                const isLevelSufficient =
                    heroInfo.level >= skillRequirement.requiredHeroLevel;
                const isFriendsSufficient =
                    profileInfo.friends >= skillRequirement.requiredFriends;
                const isRequiredSkillsLevelsSufficient = Object.entries(
                    skillRequirement.requiredSkills || {}
                ).every(([requiredSkill, requiredLevel]) => {
                    const skillLevel = skillLevels[requiredSkill]?.level || 0;
                    if (skillLevel < requiredLevel) {
                        missingRequirements[requiredSkill] = requiredLevel;
                        return false;
                    }
                    return true;
                });

                isCanUpgraded =
                    isLevelSufficient &&
                    isFriendsSufficient &&
                    isRequiredSkillsLevelsSufficient &&
                    isCooldownOver;
            }

            return {
                id: dbSkill.key,
                isActive: currentLevel > 0,
                currentLevel,
                isMaxLevel,
                isMaxLevelMore: currentLevel > dbSkill.maxLevel,
                isPenultimateLevel: nextLevel === dbSkill.maxLevel,
                levels: dbSkill.levels,
                profitNextLevel,
                profitCurrent,
                isCanUpgraded: isCanUpgraded,
                priceNextLevel: getPrice(dbSkill, nextLevel),
                profitIncrement: profitNextLevel - profitCurrent,
            };
        });
};

function checkCooldown(dbSkill: DbSkill, skillLevels: SkillsResponse): boolean {
    const skillInfo = skillLevels[dbSkill.key];

    if (!skillInfo.finishUpgradeDate) {
        return true;
    }

    const finishUpgradeDate = new Date(skillInfo.finishUpgradeDate);
    return new Date() > finishUpgradeDate;
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
