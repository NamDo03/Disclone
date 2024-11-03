import { StreamClient } from '@stream-io/node-sdk';

const apiKey = process.env.API_VIDEO;
const secret = process.env.SECRET_VIDEO;
const videoClient = new StreamClient(apiKey, secret, { timeout: 60_000 });

export default videoClient