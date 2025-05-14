import React, { useState, useEffect } from 'react';
import { Player } from '../types';
import { getStoredPlayer } from '../utils/gameUtils';
import { User, Phone } from 'lucide-react';

interface RegistrationFormProps {
  onRegister: (player: Player) => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onRegister }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState({ name: '', phone: '' });
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const storedPlayer = getStoredPlayer();
    if (storedPlayer) {
      setName(storedPlayer.name);
      setPhone(storedPlayer.phone);
    }
  }, []);
  
  const validateForm = (): boolean => {
    const newErrors = { name: '', phone: '' };
    let isValid = true;
    
    if (!name.trim()) {
      newErrors.name = 'Vui lòng nhập họ tên';
      isValid = false;
    }
    
    if (!phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
      isValid = false;
    } else if (!/^[0-9]{10}$/.test(phone)) {
      newErrors.phone = 'Số điện thoại phải có 10 chữ số';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      try {
        const apiDomain = import.meta.env.VITE_API_DOMAIN;
        const response = await fetch(`${apiDomain}/api/v1/game/start`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            phone,
          }),
        });

        if (!response.ok) {
          throw new Error('Không thể bắt đầu trò chơi');
        }

        const result = await response.json();
        
        if (result.status === 'success') {
          onRegister({ 
            name, 
            phone,
            sessionId: result.data.session_id,
            remainingPlays: result.data.remainingPlays
          });
        } else {
          throw new Error(result.message || 'Không thể bắt đầu trò chơi');
        }
      } catch (error) {
        setErrors(prev => ({
          ...prev,
          name: error instanceof Error ? error.message : 'Đã có lỗi xảy ra'
        }));
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-bold text-center text-purple-800 mb-4">Đăng Ký Tham Gia</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-2">
            Họ và tên
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              id="name"
              className={`w-full pl-10 pr-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500`}
              placeholder="Nhập họ và tên"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
          </div>
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
        </div>
        
        <div className="mb-6">
          <label htmlFor="phone" className="block text-gray-700 text-sm font-medium mb-2">
            Số điện thoại
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone size={18} className="text-gray-400" />
            </div>
            <input
              type="tel"
              id="phone"
              className={`w-full pl-10 pr-3 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500`}
              placeholder="Nhập số điện thoại"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isLoading}
            />
          </div>
          {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
            isLoading ? 'opacity-75 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Đang xử lý...' : 'Bắt Đầu Chơi'}
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;