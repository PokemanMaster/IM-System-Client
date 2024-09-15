import React, {useEffect, useState, useRef} from 'react';
import {Input, Button} from 'react-vant';
import {SmileOutlined, AudioOutlined, PlusOutlined} from '@ant-design/icons';
import './style.less';
import Header from "../../components/header";
import {useLocation} from "react-router-dom";
import {RedisMsgAPI} from "../../api/chat";
import {listCommunityAPI} from "../../api/group";

export default function ChatPage() {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]); // 用于存储所有聊天消息
    const [isWsOpen, setIsWsOpen] = useState(false); // 用于跟踪 WebSocket 是否连接成功
    const location = useLocation();
    const {groupinfo} = location.state || {};
    const wsRef = useRef(null); // 用于存储 WebSocket 实例
    const IM = JSON.parse(localStorage.getItem("IM"));

    useEffect(() => {
        console.log(groupinfo);
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
                // 筛选出 Type: 2 的消息
                if (receivedMessage.Type === 2) {
                    setMessages((prevMessages) => [...prevMessages, receivedMessage].sort((a, b) => a.CreateTime - b.CreateTime));
                }
            } catch (e) {
                console.error('Error parsing message:', e);
            }
        };
    }, [IM.ID, IM.Identity]);

    useEffect(() => {
        listCommunityAPI({
            "TargetID": groupinfo.ID,
        }).then(res => {
            // 遍历返回的每一条数据
            res.data.forEach(community => {
                const {OwnerId} = community;
                // 为每一个 OwnerId 执行 RedisMsgAPI
                RedisMsgAPI({
                    "UserIdA": OwnerId, // 群 ID
                    "UserIdB": groupinfo.ID, // 群成员的 OwnerId
                    "Start": 0,
                    "End": -1,
                    "IsRev": true,
                }).then(redisRes => {
                    const receivedMessages = redisRes.data.map(item => {
                        try {
                            const message = JSON.parse(item);
                            return {...message, Content: message.Content};
                        } catch (e) {
                            console.error('Error parsing message:', e);
                            return null;
                        }
                    }).filter(msg => msg !== null && msg.Type === 2); // 筛选 Type: 2
                    setMessages(prevMessages => [...prevMessages, ...receivedMessages].sort((a, b) => a.CreateTime - b.CreateTime));
                }).catch(err => {
                    console.log("Error calling RedisMsgAPI:", err);
                });
            });
        }).catch(err => {
            console.log("Error calling listCommunityAPI:", err);
        });
    }, [IM.ID, IM.Identity]);

    // 发送消息
    const handleSend = () => {
        if (isWsOpen && wsRef.current && message) {
            const msg = {
                "TargetId": groupinfo.ID, // 群 id
                "Type": 2, // 群类型
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
            <Header name={groupinfo?.Name || 'Chat'}/>
            <div className="chat-container">

                {/* 消息展示区 */}
                <div className="chat-messages">
                    {messages.map((msg, index) => (
                        <div key={index} className={msg.userId === IM.ID ? 'messageM' : 'message'}>
                            <div className={msg.userId === IM.ID ? 'avatarM' : 'avatar'}>
                                <img src="https://via.placeholder.com/40" alt="avatar"/>
                            </div>
                            <div className={msg.userId === IM.ID ? 'message-contentM' : 'message-content'}>
                                {msg.Content}
                            </div>
                        </div>
                    ))}
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
