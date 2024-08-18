import axios from 'axios';
import UserAgent from 'user-agents';
import { dateNowInSeconds } from './date.js';
import { Md5 } from 'ts-md5';

const axiosClient = axios.create({
    baseURL: 'https://api.xempire.io',
    headers: {
        Accept: '*/*',
        'Accept-Language': 'ru,ru-RU;q=0.9,en-US;q=0.8,en;q=0.7',
        'Content-Type': 'application/json',
        'Is-Beta-Server': 'null',
        Origin: 'https://game.xempire.io',
        Referer: 'https://game.xempire.io',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
        'User-Agent': new UserAgent({ deviceCategory: 'mobile' }).toString(),
        'Sec-Ch-Ua': generateRandomSecChUa(),
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
        config.headers['Api-Hash'] = Md5.hashStr(
            `${time}_${JSON.stringify(o ? config.data : '{}')}`
        );
        config.headers['Api-Time'] = time;

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

function generateRandomSecChUa(): string {
    const brands = [
        '"Not/A)Brand"',
        '"Chromium"',
        '"Google Chrome"',
        '"Firefox"',
        '"Safari"',
        '"Edge"',
        '"Opera"',
        '"Brave"',
        '"Vivaldi"',
        '"Android WebView"',
    ];

    // Function to generate a random version number
    const randomVersion = () => Math.floor(Math.random() * 20) + 100;

    // Randomly shuffle the brands array
    const shuffledBrands = brands.sort(() => 0.5 - Math.random());

    // Generate the Sec-Ch-Ua string
    return shuffledBrands
        .slice(0, 3)
        .map((brand, index) => {
            const version = randomVersion();
            return `${brand};v="${index + 1 === 1 ? 8 : version}"`;
        })
        .join(', ');
}

export { axiosClient };
