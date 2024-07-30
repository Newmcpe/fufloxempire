import { Proxy } from 'util/config-schema.js';
import {
    FightResponse,
    Hero,
    LoadDbResponse,
    MuskEmpireResponse,
    ProfileInfoResponse,
    SkillsResponse,
} from './model.js';
import { axiosClient } from '../../util/axios.js';
import { AxiosResponse } from 'axios';

const authByTelegramWebApp = async (
    body: {
        data: {
            initData: string;
            platform: string;
            chatId: string;
            chatType?: string;
            chatInstance?: string;
        };
    },
    proxy: Proxy | null
): Promise<AxiosResponse> => axiosClient.post(`telegram/auth`, body);

const loadDb = async (
    token: string
): Promise<AxiosResponse<MuskEmpireResponse<LoadDbResponse>>> =>
    axiosClient.post(
        `dbs`,
        {
            data: {
                dbs: ['all'],
            },
        },
        {
            headers: {
                'Api-Key': token,
            },
        }
    );

const skills = async (
    token: string
): Promise<AxiosResponse<MuskEmpireResponse<SkillsResponse>>> =>
    axiosClient.post(
        `skills`,
        {},
        {
            headers: {
                'Api-Key': token,
            },
        }
    );

const getHeroInfo = async (
    token: string
): Promise<AxiosResponse<MuskEmpireResponse<Hero>>> =>
    axiosClient.post(
        `hero/info`,
        {},
        {
            headers: {
                'Api-Key': token,
            },
        }
    );
///skills/improve
const improveSkill = async (
    token: string,
    skillId: string
): Promise<AxiosResponse> =>
    axiosClient.post(
        `skills/improve`,
        {
            data: skillId,
        },
        {
            headers: {
                'Api-Key': token,
            },
        }
    );

const claimOfflineBonus = async (token: string): Promise<AxiosResponse> =>
    axiosClient.post(
        `hero/bonus/offline/claim`,
        {},
        {
            headers: {
                'Api-Key': token,
            },
        }
    );
const claimPvp = async (token: string): Promise<AxiosResponse> =>
    axiosClient.post(
        `pvp/claim`,
        {},
        {
            headers: {
                'Api-Key': token,
            },
        }
    );

const fightPvp = async (
    token: string,
    league: string,
    strategy: string
): Promise<AxiosResponse<MuskEmpireResponse<FightResponse>>> =>
    axiosClient.post(
        `pvp/fight`,
        {
            data: {
                league,
                strategy,
            },
        },
        {
            headers: {
                'Api-Key': token,
            },
        }
    );

const getProfileInfo = async (
    token: string
): Promise<AxiosResponse<MuskEmpireResponse<ProfileInfoResponse>>> =>
    axiosClient.post(
        `profile/info`,
        {},
        {
            headers: {
                'Api-Key': token,
            },
        }
    );

const tap = async (
    token: string,
    amount: number,
    currentEnergy: number
): Promise<AxiosResponse<MuskEmpireResponse<never>>> =>
    axiosClient.post(
        `hero/action/tap`,
        {
            data: {
                data: {
                    amount,
                    currentEnergy,
                },
                seconds: 1 + Math.floor(Math.random() * 20),
            },
        },
        {
            headers: {
                'Api-Key': token,
            },
            validateStatus: function (status) {
                return status < 500;
            },
        }
    );

export {
    loadDb,
    skills,
    authByTelegramWebApp,
    getHeroInfo,
    improveSkill,
    claimOfflineBonus,
    fightPvp,
    claimPvp,
    getProfileInfo,
    tap,
};
