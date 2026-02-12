import React, { useState, useCallback } from 'react';
import client from '../api/client.js';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    userName: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.userName || !formData.password) {
      alert("IDとパスワードは必須です");
      return;
    }

    try {
      await client.post('/auth/register', formData);
      alert("登録が完了しました！ログインしてください。");
      navigate('/login');
    } catch (err) {
      console.error("登録失敗", err);
      alert("登録に失敗しました。");
    }
  }, [formData, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">新規アカウント登録</h2>
        
        <form onSubmit={handleRegister} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">名前</label>
            <input
              name="userName"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              value={formData.userName}
              onChange={handleChange}
              placeholder="表示名を入力"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">パスワード</label>
            <input
              type="password"
              name="password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              value={formData.password}
              onChange={handleChange}
              placeholder="6文字以上を推奨"
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-md transform active:scale-95 transition-all duration-150"
          >
            アカウント作成
          </button>
        </form>

        <div className="mt-8 text-center border-t pt-6">
          <p className="text-sm text-gray-600">
            すでにアカウントをお持ちですか？{" "}
            <Link to="/login" className="text-green-600 hover:underline font-bold">
              ログイン
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;