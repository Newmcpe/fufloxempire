import axios, { AxiosResponse } from 'axios';
import { Proxy } from 'util/config-schema.js';
import {
    FightResponse,
    HeroInfoResponse,
    LoadDbResponse,
    ProfileInfoResponse,
    SkillsResponse,
} from './model.js';

const BASE_DOMAIN = 'https://api.muskempire.io';

const authByTelegramWebApp = async (
    body: {
        //{"data":{"initData":"user=%7B%22id%22%3A277588744%2C%22first_name%22%3A%22%D0%90%D0%BB%D0%B8%D0%BD%D0%B0%22%2C%22last_name%22%3A%22%F0%9F%8F%B3%EF%B8%8F%E2%80%8D%E2%9A%A7%EF%B8%8F%22%2C%22username%22%3A%22Newmcpe%22%2C%22language_code%22%3A%22ru%22%2C%22is_premium%22%3Atrue%2C%22allows_write_to_pm%22%3Atrue%7D&chat_instance=-8493099482055851733&chat_type=sender&auth_date=1721560449&hash=786a242acce68b986cbe85e07766086b06ef3f385a3d1a86129471b1ac1584d9","platform":"android","chatId":"","chatType":"sender","chatInstance":"-8493099482055851733"}}
        data: {
            initData: string;
            platform: string;
            chatId: string;
            chatType: string;
            chatInstance: string;
        };
    },
    proxy: Proxy | null
): Promise<AxiosResponse> => axios.post(`${BASE_DOMAIN}/telegram/auth`, body);

const loadDb = async (token: string): Promise<AxiosResponse<LoadDbResponse>> =>
    axios.get(`${BASE_DOMAIN}/dbs`, {
        headers: {
            'Api-Key': token,
        },
    });

const skills = async (token: string): Promise<AxiosResponse<SkillsResponse>> =>
    axios.get(`${BASE_DOMAIN}/skills`, {
        headers: {
            'Api-Key': token,
        },
    });

const getHeroInfo = async (
    token: string
): Promise<AxiosResponse<HeroInfoResponse>> =>
    axios.get(`${BASE_DOMAIN}/hero/info`, {
        headers: {
            'Api-Key': token,
        },
    });
///skills/improve
const improveSkill = async (
    token: string,
    skillId: string
): Promise<AxiosResponse> =>
    axios.post(
        `${BASE_DOMAIN}/skills/improve`,
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
    axios.post(
        `${BASE_DOMAIN}/hero/bonus/offline/claim`,
        {},
        {
            headers: {
                'Api-Key': token,
            },
        }
    );
const claimPvp = async (token: string): Promise<AxiosResponse> =>
    axios.post(
        `${BASE_DOMAIN}/pvp/claim`,
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
): Promise<AxiosResponse<FightResponse>> =>
    axios.post(
        `${BASE_DOMAIN}/pvp/fight`,
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
): Promise<AxiosResponse<ProfileInfoResponse>> =>
    axios.get(`${BASE_DOMAIN}/profile/info`, {
        headers: {
            'Api-Key': token,
        },
    });

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
};
