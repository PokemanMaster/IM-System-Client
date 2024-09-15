import React, {useState} from 'react';
import {Input, Button, Toast} from 'react-vant';
import {useNavigate} from 'react-router-dom';
import './style.less';
import {RegisterAPI} from "../../api/users";

const Register = () => {
    const [user, setUser] = useState({name: '', passwd: '', identity: ''});
    const navigate = useNavigate();

    const handleRegister = async () => {
        console.log(user)
        RegisterAPI({
            "UserName": user.name,
            "Password": user.passwd,
            "Identity": user.identity,
        }).then((res) => {
            console.log(res)
        }).catch((err) => {
            console.log(err)
        });
    };

    return (
        <div className="register-container">
            <header className="register-header">注册</header>
            <div className="register-form">
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
                <Input
                    type="identity"
                    placeholder="请再次输入密码"
                    value={user.identity}
                    onChange={(value) => setUser({...user, identity: value})}
                    className="input-row"
                    clearable
                />
            </div>
            <div className="register-actions">
                <Button type="primary" block onClick={handleRegister}>
                    注册
                </Button>
                <div className="link-area">
                    <a onClick={()=> navigate("/login")}>前往登录</a>
                    <span className="spliter">|</span>
                    <a>忘记密码</a>
                </div>
            </div>
        </div>
    );
};

export default Register;
