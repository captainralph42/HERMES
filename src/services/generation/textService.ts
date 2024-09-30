import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: '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', dangerouslyAllowBrowser: true });

export async function generatePunchline(
    humorValue: number, 
    loveValue: number, 
    subtletyValue: number, 
    lengthValue: number, 
    alphPrice: number | null,  
    btcPrice: number
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

        // Vérification que le response et son contenu ne sont pas null/undefined
        if (response?.choices?.[0]?.message?.content) {
            let punchline = response.choices[0].message.content.trim();

            // Nettoyer les parenthèses dans l'output
            punchline = punchline.replace(/\(.*?\)/g, '');

            // Ajouter des guillemets uniquement si la punchline n'en a pas déjà
            if (!punchline.startsWith('"') && !punchline.endsWith('"')) {
                return `"${punchline}"`;
            }

            return punchline;
        } else {
            return 'Erreur lors de la génération de punchline';
        }
    } catch (error) {
        console.error('Erreur lors de la génération de punchline', error);
        return 'Erreur lors de la génération de punchline. Veuillez réessayer.';
    }
}
