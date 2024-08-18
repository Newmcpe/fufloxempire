import { DbSkill } from '../api/muskempire/model.js';

const smartRound = (value: number): number => {
    const roundToNearest = (number: number, nearest: number): number => {
        return Math.round(number / nearest) * nearest;
    };

    if (value < 50) return Math.round(value);
    if (value < 100) return roundToNearest(value, 5);
    if (value < 500) return roundToNearest(value, 25);
    if (value < 1000) return roundToNearest(value, 50);
    if (value < 5000) return roundToNearest(value, 100);
    if (value < 10000) return roundToNearest(value, 200);
    if (value < 100000) return roundToNearest(value, 500);
    if (value < 500000) return roundToNearest(value, 1000);
    if (value < 1000000) return roundToNearest(value, 5000);
    if (value < 50000000) return roundToNearest(value, 10000);
    if (value < 100000000) return roundToNearest(value, 50000);

    return roundToNearest(value, 100000);
};

const fnCompound = (e: number, t: number, s: number) => {
    let c = s / 100;
    return t * Math.pow(1 + c, e - 1);
};
const fnCubic = (e: number, t: number) => {
    return t * e * e * e;
};
const fnExponential = (e: number, t: number, s: number) => {
    return t * Math.pow(s / 10, e);
};
const fnLinear = (e: number, t: number) => {
    return t * e;
};
const fnLogarithmic = (e: number, t: number) => {
    return t * Math.log2(e + 1);
};

const fnQuadratic = (e: number, t: number) => {
    return t * e * e;
};

const fnPayback = (level: number, skill: DbSkill): number => {
    const paybackTimes = [0];

    for (let currentLevel = 1; currentLevel <= level; currentLevel++) {
        const previousPayback = paybackTimes[currentLevel - 1];
        const price = getPrice(skill, currentLevel);
        const profit =
            skill.profitBasic + skill.profitFormulaK * (currentLevel - 1);
        const paybackTime = smartRound(previousPayback + price / profit);

        paybackTimes.push(paybackTime);
    }

    return paybackTimes[level];
};

export const getPrice = (e: DbSkill, level: number) => {
    return level
        ? calcFormula(e.priceFormula, level, e.priceBasic, e.priceFormulaK)
        : 0;
};
export const getProfit = (e: DbSkill, level: number) => {
    return level
        ? calcFormula(
              e.profitFormula,
              level,
              e.profitBasic,
              e.profitFormulaK,
              e
          )
        : 0;
};

const calcFormula = (
    formulaType: string,
    t: number,
    s: number,
    c: number,
    skill?: DbSkill
): number => {
    let result = s;

    switch (formulaType) {
        case 'fnCompound':
            result = fnCompound(t, s, c);
            break;
        case 'fnLogarithmic':
            result = fnLogarithmic(t, s);
            break;
        case 'fnLinear':
            result = fnLinear(t, s);
            break;
        case 'fnQuadratic':
            result = fnQuadratic(t, s);
            break;
        case 'fnCubic':
            result = fnCubic(t, s);
            break;
        case 'fnExponential':
            result = fnExponential(t, s, c);
            break;
        case 'fnPayback':
            if (skill) {
                result = fnPayback(t, skill);
            }
            break;
        default:
            throw new Error(`Unknown formula type: ${formulaType}`);
    }

    return smartRound(result);
};

export function formatNumber(number: number) {
    return number.toLocaleString(undefined, {
        maximumFractionDigits: 2,
    });
}
