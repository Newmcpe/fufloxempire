import axios from 'axios';
import UserAgent from 'user-agents';
import { dateNowInSeconds } from './date.js';
import { Md5 } from 'ts-md5';

const axiosClient = axios.create({
    baseURL: 'https://api.muskempire.io',
    headers: {
        Accept: '*/*',
        'Accept-Language': 'ru,ru-RU;q=0.9,en-US;q=0.8,en;q=0.7',
        'Content-Type': 'application/json',
        'Is-Beta-Server': 'null',
        Origin: 'https://game.muskempire.io',
        Referer: 'https://game.muskempire.io/',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
        'User-Agent': new UserAgent().random().toString(),
        'Sec-Ch-Ua':
            '"Not/A)Brand";v="8", "Chromium";v="126", "Android WebView";v="126"',
        'Sec-Ch-Ua-Mobile': '?1',
        'Sec-Ch-Ua-Platform': '"Android"',
        'X-Requested-With': 'org.telegram.messenger.web',
    },
});

axiosClient.interceptors.request.use(
    (config) => {
        const time = dateNowInSeconds();

        if (config.url!.includes('telegram/auth')) {
            config.headers['Api-Key'] = 'empty';
        }

        const o = !!config.data;

        config.headers['Api-Hash'] = finishHash(o ? config.data : '{}', time);
        config.headers['Api-Time'] = time;

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const finishHash = (data: Object, time: number) =>
    Md5.hashStr(`${time}_${JSON.stringify(data)}`);

export { axiosClient };
