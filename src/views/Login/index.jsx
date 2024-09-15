import React, {useState} from 'react';
import {Input, Button, Toast} from 'react-vant';
import {useNavigate} from 'react-router-dom';
import './style.less';
import {LoginAPI} from "../../api/users";

const Login = () => {
    const [user, setUser] = useState({name: '', passwd: ''});
    const navigate = useNavigate();

    const handleLogin = () => {
        LoginAPI({
            "Name": user.name,
            "Password": user.passwd
        }).then(res => {
                console.log(res)
                const {ID, Identity} = res.data;
                console.log(ID, Identity)
                localStorage.setItem("IM", JSON.stringify(res.data));
                navigate(`/layout/friends?userId=${ID}&&token=${Identity}`);
            }
        ).catch(err => {
            console.log(err)
        })
    };

    return (
        <div className="login-container">
            <header className="login-header">登录</header>
            <div className="login-form">
                <Input
                    placeholder="请输入用户名"
                    value={user.name}
                    onChange={(value) => setUser({...user, name: value})}
                    className="input-row"
                    clearable
                />
                <Input
                    type="password"
                    placeholder="请输入密码"
                    value={user.passwd}
                    onChange={(value) => setUser({...user, passwd: value})}
                    className="input-row"
                    clearable
                />
            </div>
            <div className="login-actions">
                <Button type="primary" block onClick={handleLogin}>
                    登录
                </Button>
                <div className="link-area">
                    <a onClick={() => navigate("/register")}>注册账号</a>
                    <span className="spliter">|</span>
                    <a>忘记密码</a>
                </div>
            </div>
        </div>
    );
};

export default Login;
