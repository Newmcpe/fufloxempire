import { Proxy } from '../../util/config.js';
import {
    FightResponse,
    Hero,
    LoadDbResponse,
    MuskEmpireResponse,
    ProfileInfoResponse,
    SkillsResponse,
} from './model.js';
import { axiosClient } from '../../util/axios-client.js';
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

//pvp/info
const getUserAllData = async (token: string): Promise<AxiosResponse<Object>> =>
    axiosClient.post(
        `user/data/all`,
        {},
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
    currentEnergy: number,
    seconds: number
): Promise<AxiosResponse<MuskEmpireResponse<never>>> =>
    axiosClient.post(
        `hero/action/tap`,
        {
            data: {
                data: {
                    amount,
                    currentEnergy,
                },
                seconds: seconds,
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
    getUserAllData,
};
