import { parseOpenAIStream } from './utils';
import { IMessage } from './interface';

export const generateImageWithText = async (
    apiKey: string,
    prompt: string,
    controller: AbortController
) => {
    const requestInit: RequestInit = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
        },
        method: 'POST',
        body: JSON.stringify({
            prompt: prompt,
            n: 1,
            size: '512x512',
        }),
        signal: controller.signal,
    };
    try {
        const res = await fetch(
            `https://api.openai.com/v1/images/generations`,
            requestInit
        ).then(async (response) => {
            if (!response.ok) {
                const text = await response.text();
                throw JSON.parse(text);
            }
            return response;
        });
        return res;
    } catch (error) {
        throw error;
    }
};

export const chatWithGptTurbo = async (
    apiKey: string,
    messages: IMessage[],
    controller: AbortController
) => {
    const requestInit: RequestInit = {
        headers: {
            'User-Agent':'EmoBot(Azalea)/1.0.5',
            'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
            token: '${apiKey}',
            messages: messages.map((item) => ({
                role: item.role,
                content: item.content,
            })),
            clearMsg: false,
        }),
        signal: controller.signal,
    };

    try {
        const res = await fetch(
            `https://api-yinying-cn.wingmark.cn/chat_v2/AstellAI/`,
            requestInit
        ).then(async (response) => {
            if (!response.ok) {
                const text = await response.text();
                throw JSON.parse(text);
            }
            return response;
        });
        return new Response(parseOpenAIStream(res));
    } catch (error) {
        throw error;
    }
};

export const chatWithGptTurboByProxy = async (
    messages: IMessage[],
    controller: AbortController
) => {
    try {
        const res = await fetch(`/api/chat_with_gpt_by_proxy`, {
            method: 'POST',
            body: JSON.stringify({
                messages: messages.map((item) => ({
                    role: item.role,
                    content: item.content,
                })),
            }),
            signal: controller.signal,
        }).then(async (response) => {
            if (!response.ok) {
                const text = await response.text();
                throw JSON.parse(text);
            }
            return response;
        });
        return new Response(parseOpenAIStream(res));
    } catch (error) {
        throw error;
    }
};

export const getCurrentApiKeyBilling = async (apiKey: string) => {
    const res = await fetch(
        `https://api.openai.com/dashboard/billing/credit_grants`,
        {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
                Accept: 'application/json',
            },
            method: 'GET',
        }
    );
    return res.json();
};
