// calcFormula(e, t, s, c, i) {
//         let n = s;
//
//         return (
//           e === 'fnCompound' && (n = this.fnCompound(t, s, c)),
//           e === 'fnLogarithmic' && (n = this.fnLogarithmic(t, s)),
//           e === 'fnLinear' && (n = this.fnLinear(t, s)),
//           e === 'fnQuadratic' && (n = this.fnQuadratic(t, s)),
//           e === 'fnCubic' && (n = this.fnCubic(t, s)),
//           e === 'fnExponential' && (n = this.fnExponential(t, s, c)),
//           e === 'fnPayback' && (n = this.fnPayback(t, i)),
//           this.smartRound(n)
//         );
//       },
//       fnCompound(e, t, s) {
//         let c = s / 100;
//
//         return t * Math.pow(1 + c, e - 1);
//       },
//       fnCubic(e, t) {
//         return t * e * e * e;
//       },
//       fnExponential(e, t, s) {
//         return t * Math.pow(s / 10, e);
//       },
//       fnLinear(e, t) {
//         return t * e;
//       },
//       fnLogarithmic(e, t) {
//         return t * Math.log2(e + 1);
//       },
//       fnPayback(e, t) {
//         let s = [0];
//
//         for (let c = 1; c <= e; c++) {
//           const i = s[c - 1],
//             n = this.getPrice(t, c),
//             S = t.profitBasic + t.profitFormulaK * (c - 1),
//             L = this.smartRound(i + n / S);
//
//           s.push(L);
//         }
//
//         return s[e];
//       },
//       fnQuadratic(e, t) {
//         return t * e * e;
//       },
//       getPrice(e, t) {
//         return t
//           ? this.calcFormula(e.priceFormula, t, e.priceBasic, e.priceFormulaK)
//           : 0;
//       },
//       getProfit(e, t) {
//         return t
//           ? this.calcFormula(
//               e.profitFormula,
//               t,
//               e.profitBasic,
//               e.profitFormulaK,
//               e
//             )
//           : 0;
//       },
//      smartRound(e) {
//         function t(s, c = 100) {
//           return Math.round(s / c) * c;
//         }
//
//         return e < 50
//           ? Math.round(e)
//           : e < 100
//             ? t(e, 5)
//             : e < 500
//               ? t(e, 25)
//               : e < 1e3
//                 ? t(e, 50)
//                 : e < 5e3
//                   ? t(e, 100)
//                   : e < 1e4
//                     ? t(e, 200)
//                     : e < 1e5
//                       ? t(e, 500)
//                       : e < 5e5
//                         ? t(e, 1e3)
//                         : e < 1e6
//                           ? t(e, 5e3)
//                           : e < 5e7
//                             ? t(e, 1e4)
//                             : e < 1e8
//                               ? t(e, 5e4)
//                               : t(e, 1e5);
//       }
import {DbSkill} from "../api/muskempire/model.js";

const smartRound = (e: number) => {
  const t = (s: number, c = 100) => {
	return Math.round(s / c) * c;
  }
  return e < 50
	? Math.round(e)
	: e < 100
	  ? t(e, 5)
	  : e < 500
		? t(e, 25)
		: e < 1e3
		  ? t(e, 50)
		  : e < 5e3
			? t(e, 100)
			: e < 1e4
			  ? t(e, 200)
			  : e < 1e5
				? t(e, 500)
				: e < 5e5
				  ? t(e, 1e3)
				  : e < 1e6
					? t(e, 5e3)
					: e < 5e7
					  ? t(e, 1e4)
					  : e < 1e8
						? t(e, 5e4)
						: t(e, 1e5);
}

const fnCompound = (e: number, t: number, s: number) => {
  let c = s / 100;
  return t * Math.pow(1 + c, e - 1);
}
const fnCubic = (e: number, t: number) => {
  return t * e * e * e;
}
const fnExponential = (e: number, t: number, s: number) => {
  return t * Math.pow(s / 10, e);
}
const fnLinear = (e: number, t: number) => {
  return t * e;
}
const fnLogarithmic = (e: number, t: number) => {
  return t * Math.log2(e + 1);
}

const fnQuadratic = (e: number, t: number) => {
  return t * e * e;
}

//  fnPayback(e, t) {
//         let s = [0];
//
//         for (let c = 1; c <= e; c++) {
//           const i = s[c - 1],
//             n = this.getPrice(t, c),
//             S = t.profitBasic + t.profitFormulaK * (c - 1),
//             L = this.smartRound(i + n / S);
//
//           s.push(L);
//         }
//
//         return s[e];
//       },
const fnPayback = (e: number, t: DbSkill) => {
  let s = [0];
  for (let c = 1; c <= e; c++) {
	const i = s[c - 1],
	  n = getPrice(t, c),
	  S = t.profitBasic + t.profitFormulaK * (c - 1),
	  L = smartRound(i + n / S);
	s.push(L);
  }
  return s[e];
}

export const getPrice = (e: DbSkill, level: number) => {
  return level
	? calcFormula(e.priceFormula, level, e.priceBasic, e.priceFormulaK)
	: 0;
}
export const getProfit = (e: DbSkill, level: number) => {
return level
	? calcFormula(e.profitFormula, level, e.profitBasic, e.profitFormulaK, e)
	: 0;
}

const calcFormula = (e: string, t: number , s: number, c: number, i?: DbSkill) => {
  let n = s;
  return (
	e === 'fnCompound' && (n = fnCompound(t as number, s, c)),
	e === 'fnLogarithmic' && (n = fnLogarithmic(t as number, s)),
	e === 'fnLinear' && (n = fnLinear(t as number, s)),
	e === 'fnQuadratic' && (n = fnQuadratic(t as number, s)),
	e === 'fnCubic' && (n = fnCubic(t as number, s)),
	e === 'fnExponential' && (n = fnExponential(t as number, s, c)),
	e === 'fnPayback' && (n = fnPayback(t, i!)),
	smartRound(n)
  );

}