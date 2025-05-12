import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="mt-8 py-6 bg-purple-900 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <p className="text-sm">
            &copy; {currentYear} Vòng Quay May Mắn. Tất cả quyền được bảo lưu.
          </p>
          <div className="mt-2 text-xs text-purple-200">
            <a href="#" className="hover:underline mx-2">Điều khoản sử dụng</a>
            <a href="#" className="hover:underline mx-2">Chính sách bảo mật</a>
            <a href="#" className="hover:underline mx-2">Liên hệ</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;