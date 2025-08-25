import React, { useState, useRef, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Download, CreditCard, Sparkles, Egg, Wallet, Move } from 'lucide-react';

export function EasterCard() {
  const { address, isConnected } = useAccount();
  const [userName, setUserName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('');
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Fixed text position (perfect position found by user)
  const [textPosition] = useState({ y: 25 });

  // Mock contract interaction - replace with actual IRYS payment contract
  const { data: hash, writeContract, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const handlePayment = async () => {
    if (!userName.trim()) {
      alert('Please enter your name first!');
      return;
    }

    if (!isConnected) {
      alert('Please connect your wallet first!');
      return;
    }

    try {
      setIsGenerating(true);
      setPaymentStatus('Processing payment...');

      // Here you would integrate with actual IRYS payment contract
      // For now, we'll simulate the payment process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setPaymentStatus('Payment successful!');
      setIsPaid(true);
      
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus('Payment failed: ' + (error as Error).message);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadCard = async () => {
    if (!cardRef.current) return;

    try {
      const domtoimage = (await import('dom-to-image')).default;
      
      // Use the original card element directly
      const originalCard = cardRef.current;
      
      // Temporarily adjust positioning for download
      const originalTextElement = originalCard.querySelector('.name')?.parentElement?.parentElement;
      let originalStyles: { marginRight: string; marginBottom: string } = { marginRight: '', marginBottom: '' };
      
      if (originalTextElement) {
        // Store original styles
        originalStyles = {
          marginRight: originalTextElement.style.marginRight,
          marginBottom: originalTextElement.style.marginBottom
        };
        
        // Set download positioning - use exact same values as preview
        originalTextElement.style.marginRight = '108px';
        originalTextElement.style.marginBottom = '108px';
        console.log('🎯 Download positioning set to: 108px × 108px');
      }
      
      // Generate ultra HD image using dom-to-image
      const dataUrl = await domtoimage.toPng(originalCard, {
        quality: 1.0,
        bgcolor: 'transparent',
        width: 1536, // 4x original size (384 * 4)
        height: 2000, // 4x original size (500 * 4)
        style: {
          transform: 'scale(4)',
          transformOrigin: 'top left'
        }
      });
      
      // Restore original styles
      if (originalTextElement) {
        originalTextElement.style.marginRight = originalStyles.marginRight;
        originalTextElement.style.marginBottom = originalStyles.marginBottom;
      }
      
      // Download the image
      const link = document.createElement('a');
      link.download = `easter-card-${userName}.png`;
      link.href = dataUrl;
      link.click();
      
      console.log('🎯 Download completed with dom-to-image');
      
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download card. Please try again.');
    }
  };





  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Egg className="w-16 h-16 text-[#67FFD4]" />
            <h1 className="text-5xl font-bold" style={{ fontFamily: 'Arial, sans-serif', letterSpacing: '0.1em' }}>
              EASTER CARD GENERATOR
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Create your personalized Easter card with IRYS payment. Connect your wallet and pay 0.05 IRYS to generate your unique card.
          </p>
        </div>

        {/* Wallet Connection */}
        {!isConnected && (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center mb-8">
            <Wallet className="w-16 h-16 text-[#67FFD4] mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
            <p className="text-gray-300 mb-6">You need to connect your wallet to create your Easter card</p>
            <ConnectButton />
          </div>
        )}

        {/* Main Content */}
        {isConnected && (
          <>
                         {/* Card Preview */}
             <div className="flex justify-center mb-12">
                               
               
               <div className="card-preview">
                <div 
                  className="card w-96 h-[500px] relative rounded-3xl shadow-2xl overflow-hidden"
                  ref={cardRef}
                >
                  {/* Base SVG Card */}
                  <img 
                    src="/iryscard.svg" 
                    alt="Easter Card Base" 
                    className="w-full h-full object-cover absolute inset-0"
                  />
                  
                                                        {/* Personalized Text Overlay */}
                   <div className="absolute inset-0 flex flex-col justify-end items-center p-8 z-10">
                                           <div 
                        className="select-none"
                        style={{
                          marginRight: '108px',
                          marginBottom: '108px'
                        }}
                      >
                                                                       {/* Centered text that expands from middle */}
                         <div className="relative">
                           <p className="name text-lg font-normal text-white drop-shadow-lg tracking-wide text-center">
                             {userName || 'Your Name'}
                           </p>
                         </div>
                     </div>
                   </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-12 max-w-2xl mx-auto">
              <div className="input-group mb-6">
                <label htmlFor="userName" className="block text-lg font-semibold mb-3">
                  Your Name:
                </label>
                <input
                  id="userName"
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your name"
                  maxLength={30}
                  className="w-full p-4 border-2 border-gray-600 rounded-xl bg-black/50 text-white placeholder-gray-400 focus:border-[#67FFD4] focus:outline-none transition-colors"
                />
              </div>

              {!isPaid ? (
                <button 
                  className="w-full bg-gradient-to-r from-[#67FFD4] to-[#00D4AA] text-black font-bold py-4 px-8 rounded-xl text-lg hover:from-[#00D4AA] hover:to-[#67FFD4] transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  onClick={handlePayment}
                  disabled={isGenerating || !userName.trim()}
                >
                  <CreditCard className="inline-block w-6 h-6 mr-2" />
                  {isGenerating ? 'Processing...' : 'Pay 0.05 IRYS & Generate Card'}
                </button>
              ) : (
                <button 
                  className="w-full bg-gradient-to-r from-blue-400 to-cyan-400 text-white font-bold py-4 px-8 rounded-xl text-lg hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 transform hover:scale-105"
                  onClick={downloadCard}
                >
                  <Download className="inline-block w-6 h-6 mr-2" />
                  Download Your Card
                </button>
              )}

              {paymentStatus && (
                <div className={`mt-6 p-4 rounded-xl font-medium text-center ${
                  isPaid 
                    ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                    : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                }`}>
                  {paymentStatus}
                </div>
              )}
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center hover:transform hover:scale-105 transition-all duration-300">
                <Sparkles className="w-12 h-12 text-[#67FFD4] mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">Personalized</h3>
                <p className="text-gray-300">Add your name to create a unique card</p>
              </div>
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center hover:transform hover:scale-105 transition-all duration-300">
                <CreditCard className="w-12 h-12 text-[#67FFD4] mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">IRYS Payment</h3>
                <p className="text-gray-300">Secure blockchain payment with your wallet</p>
              </div>
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center hover:transform hover:scale-105 transition-all duration-300">
                <Download className="w-12 h-12 text-[#67FFD4] mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">High Quality</h3>
                <p className="text-gray-300">Download in high-resolution PNG format</p>
              </div>
            </div>
          </>
        )}

        {/* Footer */}
        <div className="text-center text-gray-400 border-t border-white/10 pt-8">
          <p className="text-lg">🎨 Easter Card Generator - Powered by IRYS</p>
        </div>
      </div>
    </div>
  );
}
