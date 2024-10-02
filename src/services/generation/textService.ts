import Groq from 'groq-sdk';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || '', 
    dangerouslyAllowBrowser: true
});

const smoothSliderValue = (value: number) => Math.round(value / 10) * 10;

const constructPrompt = (
    humor: string, 
    love: string, 
    subtlety: string, 
    lengthInstruction: string, 
    includePrices: boolean, 
    priceText: string
): string => {
    const basePrompt = `Write a ${lengthInstruction} ${humor}, ${love}, and ${subtlety} punchline starting with 'You', in a playful, crypto-savvy tone.`;
    const cryptoUniverse = `Make sure it revolves around the world of cryptocurrencies.`;
    const pricesPart = includePrices ? `Include the price of $ALPH and BTC if relevant. ${priceText}` : 'Avoid mentioning specific token prices.';
    return `${basePrompt} ${cryptoUniverse} ${pricesPart} One sentence only.`;
};

export async function generatePunchline(
    humorValue: number, 
    loveValue: number, 
    subtletyValue: number, 
    lengthValue: number, 
    alphPrice: number | null,  
    btcPrice: number | null
): Promise<string> {
    try {
        const humor = humorValue < 20 
            ? 'serious' 
            : humorValue < 40 
            ? 'light sarcasm' 
            : humorValue < 60 
            ? 'sarcastic' 
            : humorValue < 80 
            ? 'dark humor' 
            : 'extreme absurdity';

        const love = loveValue < 50 ? 'cold' : 'loving';
        const subtlety = subtletyValue < 50 ? 'direct' : 'subtle';
        
        const lengthInstruction = lengthValue <= 20 
            ? 'keep it very short (20-40 characters).' 
            : lengthValue <= 50 
            ? 'keep it concise (40-80 characters).' 
            : 'a bit longer (up to 120 characters).';

        const priceTextAlph = alphPrice !== null ? `The current price of $ALPH is ${alphPrice} USD.` : '';
        const priceTextBtc = btcPrice !== null ? `The current price of BTC is ${btcPrice} USD.` : '';
        const priceText = `${priceTextAlph} ${priceTextBtc}`.trim();

        const includePrices = Math.random() < 0.5;

        const prompt = constructPrompt(humor, love, subtlety, lengthInstruction, includePrices, priceText);

        const response = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama3-8b-8192',
            temperature: 0.5,
            top_p: 1,
        });

        const punchline = response?.choices?.[0]?.message?.content?.trim()?.replace(/\(.*?\)/g, '');
        return punchline ? `"${punchline}"` : 'Punchline generation error';
    } catch (error) {
        console.error('Punchline generation error', error);
        return 'Error generating punchline. Please try again.';
    }
}
