import React, { useState, useRef } from 'react';
import { useAccount, useConnect } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Upload, Plus, Eye, Trash2, Copy, CheckCircle } from 'lucide-react';


interface TextField {
  label: string;
  position: { x: number; y: number };
}





interface CardData {
  id: string;
  name: string;
  svgUrl: string;
  published: boolean;
  url: string;
  createdAt: Date;
  textFields: TextField[];
}

export function AdminDashboard() {
  const { address, isConnected } = useAccount();
  const [cards, setCards] = useState<CardData[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [textField, setTextField] = useState<TextField | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load cards from localStorage on mount
  React.useEffect(() => {
    try {
      const savedCards = localStorage.getItem('publishedCards');
      if (savedCards) {
        const parsedCards = JSON.parse(savedCards);
        // Update cards state with published cards
        setCards(prev => {
          const updatedCards = [...prev];
          parsedCards.forEach((publishedCard: CardData) => {
            const existingIndex = updatedCards.findIndex(c => c.id === publishedCard.id);
            if (existingIndex >= 0) {
              updatedCards[existingIndex] = { ...updatedCards[existingIndex], published: true };
            }
          });
          return updatedCards;
        });
      }
    } catch (error) {
      console.error('Error loading saved cards:', error);
    }
  }, []);

  const generateCardId = () => {
    return 'egcard' + (cards.length + 1);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !isConnected) return;

    setIsUploading(true);
    setUploadStatus('Uploading card...');

    try {
      // Simulate file upload (replace with actual Vercel Blob upload)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
             const newCard: CardData = {
         id: generateCardId(),
         name: file.name.replace('.svg', '').replace('.png', ''),
         svgUrl: URL.createObjectURL(file),
         published: false,
         url: `/${generateCardId()}`,
         createdAt: new Date(),
         textFields: textField ? [textField] : []
       };

      setCards(prev => [...prev, newCard]);
      setUploadStatus('Card uploaded successfully!');
      
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error) {
      setUploadStatus('Upload failed: ' + (error as Error).message);
    } finally {
      setIsUploading(false);
    }
  };

  const togglePublish = (cardId: string) => {
    setCards(prev => {
      const updatedCards = prev.map(card => {
        if (card.id === cardId) {
          // When publishing, ensure the card has the current text field position
          const updatedCard = { ...card, published: !card.published };
          if (textField && !card.published) { // Only update when publishing (not unpublishing)
            updatedCard.textFields = [textField];
          }
          return updatedCard;
        }
        return card;
      });
      
      // Save published cards to localStorage
      const publishedCards = updatedCards.filter(card => card.published);
      localStorage.setItem('publishedCards', JSON.stringify(publishedCards));
      
      return updatedCards;
    });
  };

  const deleteCard = (cardId: string) => {
    setCards(prev => prev.filter(card => card.id !== cardId));
  };

  const updatePublishedCardPosition = (cardId: string) => {
    if (!textField) return;
    
    setCards(prev => {
      const updatedCards = prev.map(card => {
        if (card.id === cardId && card.published) {
          return {
            ...card,
            textFields: [textField]
          };
        }
        return card;
      });
      
      // Update published cards in localStorage
      const publishedCards = updatedCards.filter(card => card.published);
      localStorage.setItem('publishedCards', JSON.stringify(publishedCards));
      
      // Dispatch custom event to notify live page of position update
      window.dispatchEvent(new CustomEvent('cardPositionUpdated'));
      
      setUploadStatus(`Text position updated for ${cardId}! Live page will update automatically!`);
      return updatedCards;
    });
  };

  const copyUrl = async (url: string) => {
    try {
      // Use current domain (works for both localhost and production)
      const currentDomain = window.location.origin;
      await navigator.clipboard.writeText(`${currentDomain}${url}`);
      setUploadStatus('URL copied to clipboard!');
    } catch (error) {
      setUploadStatus('Failed to copy URL');
    }
  };

  const handleCardClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (textField) {
      setUploadStatus('Text field already placed! Click on it to remove first.');
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Calculate margin values (same as live page positioning)
    // The text is positioned using marginRight and marginBottom
    const marginRight = Math.round(rect.width - x);
    const marginBottom = Math.round(rect.height - y);

    const newTextField: TextField = {
      label: 'Your Name',
      position: { x: marginRight, y: marginBottom }
    };

    setTextField(newTextField);
    setUploadStatus(`Text field placed at marginRight: ${marginRight}px, marginBottom: ${marginBottom}px`);
  };



  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">🎨 Creator Dashboard</h1>
            <p className="text-xl text-gray-300">Connect your wallet to start creating cards</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center">
            <ConnectButton />
            <p className="text-gray-400 mt-4">Anyone with this link can become a creator!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">🎨 Creator Dashboard</h1>
          <p className="text-xl text-gray-300">Welcome, {address?.slice(0, 6)}...{address?.slice(-4)}</p>
          <p className="text-gray-400">Upload your custom cards and share them with the world</p>
        </div>

        {/* Upload Section */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Upload New Card</h2>
          
          <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center hover:border-[#67FFD4] transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              accept=".svg,.png"
              onChange={handleFileUpload}
              className="hidden"
            />
            
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="bg-gradient-to-r from-[#67FFD4] to-[#00D4AA] text-black font-bold py-4 px-8 rounded-xl text-lg hover:from-[#00D4AA] hover:to-[#67FFD4] transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload className="inline-block w-6 h-6 mr-2" />
              {isUploading ? 'Uploading...' : 'Choose SVG/PNG File'}
            </button>
            
            <p className="text-gray-400 mt-4">Supports SVG and PNG files</p>
          </div>

          {uploadStatus && (
            <div className="mt-6 p-4 rounded-xl font-medium text-center bg-blue-500/20 text-blue-300 border border-blue-500/30">
              {uploadStatus}
            </div>
          )}
        </div>

        {/* Text Fields Configuration */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Text Fields Configuration</h2>
          <p className="text-gray-400 mb-6">Click on the card preview below to place 1 text field, then drag to adjust position</p>
          
                     {/* Card Preview for Text Placement */}
           <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
             <h3 className="text-lg font-semibold mb-4">Card Preview - Click to place text, then drag to adjust</h3>
                           
                                 <div 
                   className="relative w-96 h-[500px] mx-auto border-2 border-dashed border-gray-600 rounded-xl overflow-hidden cursor-crosshair hover:border-[#67FFD4] transition-colors"
                   onClick={handleCardClick}
                 >
                   {/* Show uploaded card or placeholder */}
                   {cards.length > 0 ? (
                     <img 
                       src={cards[cards.length - 1].svgUrl} 
                       alt="Uploaded card"
                       className="w-full h-full object-cover absolute inset-0"
                     />
                   ) : (
                     <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                       <span className="text-gray-500">Upload a card first, then click to place text</span>
                     </div>
                   )}
                   
                   {/* Draggable Text Field - positioned exactly like live page */}
                   {textField && (
                     <div 
                       className="absolute inset-0 flex flex-col justify-end items-center p-8 z-10"
                     >
                       <div 
                         className="select-none cursor-move"
                         style={{
                           marginRight: `${textField.position.x}px`,
                           marginBottom: `${textField.position.y}px`
                         }}
                         onMouseDown={(e) => {
                           e.preventDefault();
                           e.stopPropagation();
                           
                           const startX = e.clientX;
                           const startY = e.clientY;
                           const startMarginRight = textField.position.x;
                           const startMarginBottom = textField.position.y;
                           
                           const handleMouseMove = (e: MouseEvent) => {
                             e.preventDefault();
                             
                             const deltaX = startX - e.clientX;
                             const deltaY = startY - e.clientY;
                             
                             const newMarginRight = Math.max(0, Math.min(384, startMarginRight + deltaX));
                             const newMarginBottom = Math.max(0, Math.min(500, startMarginRight + deltaY));
                             
                             setTextField({
                               ...textField,
                               position: { x: newMarginRight, y: newMarginBottom }
                             });
                             
                             // Update published cards in real-time during drag
                             if (cards.some(card => card.published)) {
                               const updatedCards = cards.map(card => {
                                 if (card.published && card.textFields && card.textFields.length > 0) {
                                   return {
                                     ...card,
                                     textFields: [{
                                       ...textField,
                                       position: { x: newMarginRight, y: newMarginBottom }
                                     }]
                                   };
                                 }
                                 return card;
                               });
                               
                               const publishedCards = updatedCards.filter(card => card.published);
                               localStorage.setItem('publishedCards', JSON.stringify(publishedCards));
                               
                               // Dispatch custom event to notify live page
                               window.dispatchEvent(new CustomEvent('cardPositionUpdated'));
                             }
                             
                             setUploadStatus(`Text field moved to marginRight: ${Math.round(newMarginRight)}px, marginBottom: ${Math.round(newMarginBottom)}px`);
                           };
                           
                           const handleMouseUp = () => {
                             document.removeEventListener('mousemove', handleMouseMove);
                             document.removeEventListener('mouseup', handleMouseUp);
                           };
                           
                           document.addEventListener('mousemove', handleMouseMove);
                                                        document.addEventListener('mouseup', handleMouseUp);
                         }}
                         onClick={(e) => {
                           e.stopPropagation();
                           setTextField(null);
                           setUploadStatus('Text field removed');
                         }}
                       >
                         <div className="relative">
                           <p className="text-lg font-normal text-white drop-shadow-lg tracking-wide text-center">
                             {textField.label}
                           </p>
                         </div>
                       </div>
                     </div>
                   )}
                 </div>
             
             <div className="mt-4 text-center">
               <p className="text-sm text-gray-400">
                 {cards.length > 0 
                   ? "Click anywhere on the card to place text field" 
                   : "Upload a card first to see preview"
                 }
               </p>
               <p className="text-xs text-gray-500">
                 {cards.length > 0 
                   ? "Drag to adjust position • Click on text to remove" 
                   : "Then you can place and position text fields"
                 }
               </p>
               
               {textField && (
                 <button
                   onClick={() => {
                     setTextField(null);
                     setUploadStatus('Text field cleared');
                   }}
                   className="mt-3 bg-red-500/20 text-red-300 px-4 py-2 rounded-lg hover:bg-red-500/30 transition-colors text-sm"
                 >
                   Clear Text Field
                 </button>
               )}
             </div>
           </div>

          {/* Simple Text Field Setup */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <h4 className="font-semibold mb-3">Text Field: "Your Name"</h4>
            <p className="text-sm text-gray-400">Users will type their name here • Position is set by dragging</p>
          </div>
        </div>

        {/* Cards Management */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6">Your Cards</h2>
          
          {cards.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Plus className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No cards uploaded yet. Start by uploading your first card!</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {cards.map((card) => (
                <div key={card.id} className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#67FFD4] to-[#00D4AA] rounded-lg flex items-center justify-center">
                        <span className="text-black font-bold text-lg">{card.id}</span>
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-bold">{card.name}</h3>
                        <p className="text-gray-400">Created: {card.createdAt.toLocaleDateString()}</p>
                        <p className="text-sm text-gray-500">URL: {card.url}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => copyUrl(card.url)}
                        className="bg-blue-500/20 text-blue-300 px-4 py-2 rounded-lg hover:bg-blue-500/30 transition-colors"
                      >
                        <Copy className="w-4 h-4 inline mr-2" />
                        Copy URL
                      </button>
                      
                                             <button
                         onClick={() => togglePublish(card.id)}
                         className={`px-4 py-2 rounded-lg transition-colors ${
                           card.published 
                             ? 'bg-green-500/20 text-green-300 hover:bg-green-500/30' 
                             : 'bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30'
                         }`}
                       >
                         {card.published ? 'Published' : 'Draft'}
                       </button>
                       
                       {card.published && textField && (
                         <button
                           onClick={() => updatePublishedCardPosition(card.id)}
                           className="bg-blue-500/20 text-blue-300 px-4 py-2 rounded-lg hover:bg-blue-500/30 transition-colors"
                         >
                           Update Position
                         </button>
                       )}
                      
                      <button
                        onClick={() => deleteCard(card.id)}
                        className="bg-red-500/20 text-red-300 px-4 py-2 rounded-lg hover:bg-red-500/30 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                                     {card.published && (
                     <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                       <div className="flex items-center gap-2 text-green-300">
                         <CheckCircle className="w-4 h-4" />
                         <span>Live at: </span>
                         <a 
                           href={card.url} 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="text-[#67FFD4] hover:underline"
                         >
                           {window.location.host}{card.url}
                         </a>
                       </div>
                     </div>
                   )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
