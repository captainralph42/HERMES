import Groq from 'groq-sdk';

const groq = new Groq({
    apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY || '', 
    dangerouslyAllowBrowser: true
});


export async function generatePunchline(
    humorValue: number, 
    loveValue: number, 
    subtletyValue: number, 
    lengthValue: number, 
    alphPrice: number | null,  
    btcPrice: number | null
): Promise<string> {
    try {
        let humor = ''; 
        if (humorValue < 30) {
            humor = 'serious'; 
        } else if (humorValue < 60) {
            humor = 'light sarcasm'; 
        } else {
            humor = 'dark humor'; 
        }

        const love = loveValue < 50 ? 'cold' : 'loving'; 
        const subtlety = subtletyValue < 50 ? 'direct' : 'subtle'; 

        let lengthInstruction = ''; 
        if (lengthValue <= 10) {
            lengthInstruction = 'keep it extremely short (no more than 40 characters).'; 
        } else if (lengthValue <= 50) {
            lengthInstruction = 'keep it short (around 80 characters).'; 
        } else {
            lengthInstruction = 'you can make it a bit longer (around 120 characters).'; 
        }

        const priceTextAlph = alphPrice !== null ? ` The current price of $ALPH is ${alphPrice} USD.` : '';
        const priceTextBtc = btcPrice !== null ? ` The current price of BTC is ${btcPrice} USD.` : '';
        const priceText = `${priceTextAlph} ${priceTextBtc}`.trim();

        const prompt = `Write me a ${lengthInstruction} ${humor}, ${love}, and ${subtlety} punchline or loveline that starts with 'You' and is playful, crypto-savvy. Avoid any parentheses or extra explanations. Keep it witty, fun, and short. ${priceText} No more than one sentence.`;

        const response = await groq.chat.completions.create({
            messages: [
                {
                    role: 'user',
                    content: prompt,
                }
            ],
            model: 'llama3-8b-8192',
            temperature: 0.5,
            top_p: 1,
        });

        if (response?.choices?.[0]?.message?.content) {
            let punchline = response.choices[0].message.content.trim();

            punchline = punchline.replace(/\(.*?\)/g, '');

            if (!punchline.startsWith('"') && !punchline.endsWith('"')) {
                return `"${punchline}"`;
            }

            return punchline;
        } else {
            return 'Punchline generation error';
        }
    } catch (error) {
        console.error('Punchline generation error', error);
        return 'Error generating punchline. Please try again.';
    }
}
