import React from 'react';
import { Facebook, Twitter, Linkedin } from 'lucide-react';

interface SocialShareProps {
  message: string;
}

const SocialShare: React.FC<SocialShareProps> = ({ message }) => {
  const encodedMessage = encodeURIComponent(message);
  const currentUrl = encodeURIComponent(window.location.href);
  
  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}&quote=${encodedMessage}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedMessage}&url=${currentUrl}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${currentUrl}&title=${encodedMessage}`
  };
  
  const handleShare = (platform: keyof typeof shareUrls) => {
    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };
  
  return (
    <div className="flex flex-col items-center mt-8">
      <p className="text-gray-600 mb-3">Chia sẻ với bạn bè:</p>
      <div className="flex space-x-4">
        <button 
          onClick={() => handleShare('facebook')}
          className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition duration-200"
          aria-label="Share on Facebook"
        >
          <Facebook size={20} />
        </button>
        
        <button 
          onClick={() => handleShare('twitter')}
          className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center hover:bg-sky-600 transition duration-200"
          aria-label="Share on Twitter"
        >
          <Twitter size={20} />
        </button>
        
        <button 
          onClick={() => handleShare('linkedin')}
          className="w-10 h-10 rounded-full bg-blue-700 text-white flex items-center justify-center hover:bg-blue-800 transition duration-200"
          aria-label="Share on LinkedIn"
        >
          <Linkedin size={20} />
        </button>
      </div>
    </div>
  );
};

export default SocialShare;