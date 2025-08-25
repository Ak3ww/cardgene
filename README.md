# Easter Card Generator 🐰

A standalone Easter card generator with IRYS payment integration. Users can create personalized Easter cards by connecting their wallet and paying 0.05 IRYS.

## Features

- 🎨 **Custom SVG Integration**: Uses your base card design
- 💳 **IRYS Payment**: Secure blockchain payment with MetaMask
- ✨ **Personalization**: Add custom names to cards
- 📥 **High-Quality Download**: Generate PNG files with html2canvas
- 🔗 **Wallet Connection**: RainbowKit integration for easy wallet connection

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## Project Structure

```
cardgenerator/
├── src/
│   ├── components/
│   │   └── EasterCard.tsx    # Main card generator component
│   ├── App.tsx               # Main app component
│   ├── main.tsx              # React entry point
│   └── index.css             # Global styles
├── public/
│   └── iryscard.svg          # Base card SVG design
├── package.json               # Dependencies and scripts
├── vite.config.ts            # Vite configuration
├── tailwind.config.js        # Tailwind CSS configuration
└── tsconfig.json             # TypeScript configuration
```

## Customization

- **Base Card**: Replace `public/iryscard.svg` with your own design
- **Text Overlay**: Modify the text positioning and styling in `EasterCard.tsx`
- **Payment Amount**: Update the IRYS payment amount in the component
- **Styling**: Customize colors and layout using Tailwind CSS classes

## Technologies Used

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **RainbowKit** - Wallet connection
- **Wagmi** - Ethereum hooks
- **html2canvas** - Card download functionality

## IRYS Integration

The app is configured to work with the Irys testnet. To integrate with actual IRYS payments:

1. Deploy a payment contract on Irys mainnet
2. Update the contract address in the component
3. Implement proper payment verification
4. Add transaction status handling

## License

This project is for temporary Easter use. Feel free to modify and extend as needed.
