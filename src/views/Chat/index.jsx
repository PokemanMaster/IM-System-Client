import React, {useEffect, useState, useRef} from 'react';
import {Input, Button} from 'react-vant';
import {SmileOutlined, AudioOutlined, PlusOutlined} from '@ant-design/icons';
import './style.less';
import Header from "../../components/header";
import {useLocation} from "react-router-dom";
import {RedisMsgAPI} from "../../api/chat";

export default function ChatPage() {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]); // 用于存储所有聊天消息
    const [isWsOpen, setIsWsOpen] = useState(false); // 用于跟踪 WebSocket 是否连接成功
    const location = useLocation();
    const {userinfo} = location.state || {};
    const wsRef = useRef(null); // 用于存储 WebSocket 实例
    const IM = JSON.parse(localStorage.getItem("IM"));

    useEffect(() => {
        wsRef.current = new WebSocket(`ws://localhost:9000/api/v1/user/sendUserMsg?userId=${IM.ID}&&token=${IM.Identity}`);
        wsRef.current.onopen = () => {
            console.log('WebSocket connection opened');
            setIsWsOpen(true);
        };
        wsRef.current.onclose = () => {
            console.log('WebSocket connection closed');
            setIsWsOpen(false);
        };
        wsRef.current.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
        wsRef.current.onmessage = (event) => {
            console.log('Message event triggered:', event);
            console.log('Raw message data:', event.data);
            try {
                const receivedMessage = JSON.parse(event.data);
                console.log('Parsed message:', receivedMessage);
                // 根据收到消息的userId判断是否为自己的消息
                if (receivedMessage.Type === 1) {  // 只处理 Type 为 1 的消息
                    setMessages((prevMessages) => [...prevMessages, receivedMessage].sort((a, b) => a.CreateTime - b.CreateTime));
                }
            } catch (e) {
                console.error('Error parsing message:', e);
            }
        };
    }, [IM.ID, IM.Identity]);

    useEffect(() => {
        RedisMsgAPI({
            "UserIdA": IM.ID,
            "UserIdB": parseInt(userinfo.ID),
            "Start": 0,
            "End": -1,
            "IsRev": true,
        }).then(res => {
            const receivedMessages = res.data.map(item => {
                try {
                    const message = JSON.parse(item);
                    return {...message, Content: message.Content};
                } catch (e) {
                    console.error('Error parsing message:', e);
                    return null;
                }
            }).filter(msg => msg !== null && msg.Type === 1);  // 只保留 Type 为 1 的消息
            setMessages(prevMessages => [...prevMessages, ...receivedMessages].sort((a, b) => a.CreateTime - b.CreateTime));
        }).catch(err => {
            console.log(err);
        });
    }, [IM.ID, IM.Identity]); // 依赖 userId 和 token

    const handleSend = () => {
        if (isWsOpen && wsRef.current && message) {
            const msg = {
                "TargetId": userinfo.ID, // 对方id
                "Type": 1, // 好友类型
                "CreateTime": Date.now(), // 时间戳
                "userId": IM.ID, // 用户id
                "Media": 1,
                "Content": message, // 消息
            };
            wsRef.current.send(JSON.stringify(msg));
            setMessages((prevMessages) => [...prevMessages, msg].sort((a, b) => a.CreateTime - b.CreateTime));
            setMessage('');
        } else {
            console.warn('WebSocket is not open or message is empty');
        }
    };

    return (
        <>
            <Header name={userinfo?.Name || 'Chat'}/>
            <div className="chat-container">

                {/* 消息展示区 */}
                <div className="chat-messages">
                    {messages
                        .filter(msg => msg.Type === 1)  // 只显示 Type 为 1 的消息
                        .map((msg, index) => (
                            <div key={index} className={msg.userId === IM.ID ? 'messageM' : 'message'}>
                                <div className={msg.userId === IM.ID ? 'avatarM' : 'avatar'}>
                                    <img src="https://via.placeholder.com/40" alt="avatar"/>
                                </div>
                                <div className={msg.userId === IM.ID ? 'message-contentM' : 'message-content'}>
                                    {msg.Content}
                                </div>
                            </div>
                        ))
                    }
                </div>
                {/* 输入区 */}
                <div className="chat-input-area">
                    <AudioOutlined className="icon"/>
                    <Input
                        placeholder="这里写点啥"
                        value={message}
                        onChange={(value) => setMessage(value)}
                        className="chat-input"
                    />
                    <SmileOutlined className="icon"/>
                    <PlusOutlined className="icon"/>
                    <Button size="small" type="primary" onClick={handleSend}>
                        发送
                    </Button>
                </div>
            </div>
        </>
    );
}
