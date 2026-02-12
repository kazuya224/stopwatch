import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import client from "../api/client.js";

const Login: React.FC = () => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const response = await client.post('/auth/login', { userName, password });
            console.log('ログイン成功', response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
            navigate('/');
        } catch (err: any) {
            const errorData = err.response?.data;
                if (typeof errorData === 'object' && errorData !== null) {
                    setError(errorData.error || errorData.message || 'ログインに失敗しました');
                } else {
                    setError(errorData || 'ログインに失敗しました');
                }
        }
    }

    return (
        // 画面全体の中央寄せ設定
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
            {/* カード部分 */}
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">ログイン</h2>
                
                {error && (
                    <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="flex flex-col gap-6">
                    {/* ユーザー名入力 */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">ユーザー名</label>
                        <input 
                            type="text" 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                            value={userName} 
                            onChange={(e) => setUserName(e.target.value)} 
                            required 
                        />
                    </div>

                    {/* パスワード入力 */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">パスワード</label>
                        <input 
                            type="password" 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>

                    {/* ログインボタン */}
                    <button 
                        type="submit" 
                        className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-md transform active:scale-95 transition-all duration-150"
                    >
                        ログイン
                    </button>
                </form>

                {/* フッターリンク */}
                <div className="mt-8 text-center border-t pt-6">
                    <p className="text-sm text-gray-600">
                        アカウントをお持ちでないですか？{" "}
                        <Link to="/register" className="text-green-600 hover:underline font-bold">
                            新規登録
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;