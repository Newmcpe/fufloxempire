import { loadDb, skills } from './musk-empire-api.js';
import { getPrice, getProfit } from '../../util/math.js';
import { SkillRequirement } from './model.js';

export type Upgrade = {
    id: string;
    isActive: boolean;
    currentLevel: number;
    profitCurrent: number;
    profitIncrement: number;
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

    return dbSkills
        .filter((dbSkill) => dbSkill.key in skillLevels)
        .map((dbSkill) => {
            const profitCurrent = getProfit(
                dbSkill,
                skillLevels[dbSkill.key].level
            );
            const profitNextLevel = getProfit(
                dbSkill,
                skillLevels[dbSkill.key].level + 1
            );
            return {
                id: dbSkill.key,
                isActive: skillLevels[dbSkill.key].level > 0,
                currentLevel: skillLevels[dbSkill.key].level,
                profitCurrent,
                levels: dbSkill.levels,
                profitNextLevel,
                priceNextLevel: getPrice(
                    dbSkill,
                    skillLevels[dbSkill.key].level + 1
                ),
                profitIncrement: profitNextLevel - profitCurrent,
            };
        });
};
