import React, { useState, useRef } from 'react';
import { useAccount, useConnect } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Upload, Plus, Eye, Trash2, Copy, CheckCircle } from 'lucide-react';

interface CardData {
  id: string;
  name: string;
  svgUrl: string;
  published: boolean;
  url: string;
  createdAt: Date;
}

export function AdminDashboard() {
  const { address, isConnected } = useAccount();
  const [cards, setCards] = useState<CardData[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        createdAt: new Date()
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
    setCards(prev => prev.map(card => 
      card.id === cardId ? { ...card, published: !card.published } : card
    ));
  };

  const deleteCard = (cardId: string) => {
    setCards(prev => prev.filter(card => card.id !== cardId));
  };

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(`https://cardgene.vercel.app${url}`);
      setUploadStatus('URL copied to clipboard!');
    } catch (error) {
      setUploadStatus('Failed to copy URL');
    }
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
                          cardgene.vercel.app{card.url}
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
