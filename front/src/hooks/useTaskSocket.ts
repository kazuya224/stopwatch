import { useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

// 型定義（本来は src/types/index.ts に置くのがベスト）
interface User {
    userId: string;
    userName: string;
    task: string;
    status: number;
}

export const useTaskSocket = () => {
    const API_BASE_URL = import.meta.env.VITE_API_URL;
    const [users, setUsers] = useState<User[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        // 1. SockJS と STOMP クライアントの設定
        const client = new Client({
            webSocketFactory: () => {
                // URLにuserIdを付与して、サーバー側で誰の接続か判別できるようにする
                return new SockJS(`${API_BASE_URL}/ws-task?userId=${currentUser.userId}`);
            },
            reconnectDelay: 5000, // 5秒後に自動再接続（本番で重要！）
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        // 2. 接続成功時の処理
        client.onConnect = () => {
            setIsConnected(true);
            // サーバー側のブロードキャスト先を購読
            client.subscribe('/topic/tasks', (message) => {
                const data = JSON.parse(message.body);
                setUsers(data);
            });
        };

        // 3. 切断時の処理
        client.onDisconnect = () => {
            setIsConnected(false);
        };

        client.activate(); // 接続開始

        return () => {
            client.deactivate(); // コンポーネント破棄時にクリーンアップ
        };
    }, []);

    return { users, isConnected };
};