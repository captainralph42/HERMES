export const generateBackgroundImage = async (): Promise<string | null> => {
    const prompt = "Abstract patterns spread across the entire background, warm beige and pink tones, dark colors, smooth design, flowing lines, subtle glowing effects, no central focus, suitable for overlaying text";
    const width = 1080;
    const height = 1080;
    const seed = Math.floor(Math.random() * 10000);
    const model = 'flux';
    const nologo = 'true'; 
    
    const apiUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${width}&height=${height}&seed=${seed}&model=${model}&nologo=${nologo}`;
  
    try {
      const response = await fetch(apiUrl);
  
      if (!response.ok) {
        throw new Error('Error while retrieving the image');
      }
  
      return apiUrl;
    } catch (error) {
      console.error('Error in generateBackgroundImage:', error);
      return null;
    }
  };
  