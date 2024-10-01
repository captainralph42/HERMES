# **Project Overview: Hermes**

## **1. Introduction**
When we saw the theme for the Alephium Hackathon #1.5, "Why So Serious?", we knew we couldn't miss this one! The idea of creating something fun, creative, and completely out of the box was too tempting. So, we jumped into a project that blends humor and cryptocurrencies. The result? A dApp that generates crypto-related punchlines, transforms them into NFTs, and sends them directly to users' wallets. In short, we had a blast making something light-hearted and funny while staying within the NFT and blockchain universe.

## **2. The Genesis of the Project**
The "Why So Serious?" hackathon gave us total freedom to create something fun and, most importantly, not too serious. That was perfect for us because we love breaking the mold and making things enjoyable. So, we decided to create a dApp where you can generate hilarious crypto punchlines and mint them as NFTs. It all started with that simple idea: we wanted to make something that would make you smile with every click while riding the crypto hype.

With this project, we nailed the theme: it's fun, it's unpredictable, and we play with the volatility of cryptos to create quirky punchlines. It's our way of saying, "Why stress when you can have fun with blockchain?"

## **3. Key Features**
### **3.1 Punchline Generation**
- Uses an AI model to generate funny and relevant punchlines based on the crypto world.
- The punchlines are influenced by user-adjustable parameters (humor, love, subtlety) via sliders, as well as the real-time prices of cryptos like $ALPH and $BTC.

### **3.2 NFT Image Creation**
- The generated punchlines are combined with AI-generated backgrounds to create a final image.
- The image is minted as an NFT and sent directly to the user's wallet.

### **3.3 Blockchain Integration**
- The dApp is connected to the Alephium blockchain, where the punchlines are minted and stored on IPFS via Pinata.

### **3.4 User Interface**
- The interface includes a welcoming landing page with an 'Access dApp' button.
- Once inside the dApp, the user can generate a compliment/punchline by clicking a button and then mint the image as an NFT.

## **4. Minting Process Flow**
The minting process in the dApp follows a well-defined flow, separating steps between the frontend and backend:

### **4.1 User Process (Frontend)**
1. **Connection**: The user connects via a wallet extension pop-up that requests permission.
2. **Customization**: The user adjusts the sliders to set parameters (love, humor, subtlety, length).
3. **Mint**: The user clicks the 'Mint' button.

### **4.2 Backend Process (Mint)**
The backend is isolated for each user to ensure every mint is unique and independent:
4. **Groq API Call**: Generates a punchline based on the provided parameters.
5. **Pollination API Call**: Generates a background for the punchline.
6. **Punchline and Background Merge**: Generates an image that combines the punchline and background.
7. **Pinata Upload (IPFS)**: Uploads the image to Pinata, returning the NFT URI.

### **4.3 Transaction Process (Frontend)**
8. **Transaction Sent**: The mint transaction is sent to the blockchain.

## **5. Project Architecture**
The project is modularly organized to ensure easy maintenance and extensibility:
- **Frontend**: Built with React (Next.js) to manage the user interface and wallet interactions.
- **Backend**: Uses Vercel serverless to handle API routes, interactions with the AI for punchline generation, and the merging of punchlines with backgrounds.

### **5.1 Folder Structure**
- **components/**: Contains components like `PunchlineBackgroundGenerator.tsx`, `GenerateButton.tsx`, and `Footer.tsx`.
- **pages/api/**: Handles API routes for calling the AI and managing NFTs.
- **services/**: Contains backend services, like `pinataService.ts` for managing IPFS storage.
- **styles/**: Includes CSS files for layout and styling.
- **public/**: Contains assets like background images for punchlines.

## **6. Development and Technologies**

### **6.1 Tech Stack**
- **Language**: TypeScript for both frontend and backend.
- **Framework**: Next.js for optimized server-side rendering.
- **Blockchain**: Alephium for minting NFTs.
- **AI API**: Groq and Pollination.
- **Storage**: Pinata for managing files on IPFS.

### **6.2 Continuous Integration**
- Continuous deployment via Vercel. Each push to GitHub automatically triggers a redeployment, ensuring the app is always up to date.

## **7. Functionality**
### **User Steps:**
1. The user lands on the homepage.
2. They access the dApp and adjust the sliders to personalize the punchline.
3. They click ‘Mint,' and a punchline and background image are created.
4. The user clicks the button to mint the NFT, which is then sent to their wallet.

### **Back-End Flow:**
1. The API receives the parameters from the sliders.
2. The punchline is generated via groq.
3. The background is generated via pollination.
4. The punchline and background are merged to create a single image.
5. The image is stored on IPFS and minted as an NFT.

## **8. Next Steps**
- Improve the user interface for a more intuitive experience.
- Add more customization features for the punchlines and images.
- If you have any ideas, we'd love to hear from you!

## **9. Conclusion**
This project aligns perfectly with the spirit of the Alephium Hackathon #1.5, "Why So Serious?". It blends humor, creativity, and blockchain technology, offering a fun and unconventional experience. By turning punchlines into NFTs, the dApp plays with the crypto world's usual seriousness, delivering a lighthearted and engaging experience.
