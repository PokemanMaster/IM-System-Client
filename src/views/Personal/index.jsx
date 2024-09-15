import React, {useState} from "react";
import "./style.less";
import {useNavigate} from "react-router-dom";
import {Cell, Button, Image, Dialog, Input, Toast} from 'react-vant';
import Header from "../../components/header";
import {AddFriendAPI} from "../../api/friends";
import {JoinGroupsAPI} from "../../api/group";

export default function ConfirmOrder() {
    const navigate = useNavigate();
    const [showDialog, setShowDialog] = useState(false); // 控制弹出层的显示状态
    const [dialogType, setDialogType] = useState(''); // 区分是添加好友还是加入群聊
    const [inputValue, setInputValue] = useState(''); // 输入框的值
    const IM = JSON.parse(localStorage.getItem("IM"));

    const handleLogout = () => {
        localStorage.removeItem('IM');
        navigate('/login');
        Toast.info('退出登录');
    };

    const handleOpenDialog = (type) => {
        setDialogType(type);
        setInputValue('');
        setShowDialog(true); // 打开弹出层
    };

    const handleConfirm = () => {
        if (!inputValue) {
            Toast.info(dialogType === 'friend' ? '请输入好友名称' : '请输入群聊名称');
            return;
        }

        if (dialogType === 'friend') {
            AddFriend(inputValue);
        } else if (dialogType === 'group') {
            JoinGroups(inputValue);
        }

        setShowDialog(false); // 关闭弹出层
    };

    function AddFriend(targetName) {
        AddFriendAPI({
            "UserId": 1, // 假设当前用户ID为1
            "TargetName": targetName // 传入输入框的好友名称
        }).then(res => {
            Toast.success('添加好友成功');
            console.log(res);
        }).catch(err => {
            Toast.fail('添加好友失败');
            console.log(err);
        });
    }

    function JoinGroups(comId) {
        JoinGroupsAPI({
            "UserId": IM.ID, // 假设当前用户ID为1
            "ComId": comId // 传入输入框的群聊ID
        }).then(res => {
            Toast.success('加入群聊成功');
            console.log(res);
        }).catch(err => {
            Toast.fail('加入群聊失败');
            console.log(err);
        });
    }

    return (
        <div className="user-profile">
            <Header name={"个人中心"}/>
            <Cell
                title={IM.Name || "未登录"}
                icon={
                    <Image
                        src="https://example.com/profile.jpg" // 替换为实际的头像 URL
                        round
                        width="40"
                        height="40"
                    />
                }
            />

            {/* 操作选项部分 */}
            <div className="options">
                <Cell title="添加好友" isLink onClick={() => handleOpenDialog('friend')}/>
                <Cell title="加入群聊" isLink onClick={() => handleOpenDialog('group')}/>
                <Cell title="创建群聊" isLink onClick={() => navigate("/creategroup")}/>
            </div>

            {/* 退出登录按钮 */}
            <div className="logout-button">
                <Button type="danger" block onClick={() => handleLogout()}>
                    <span>退出登录</span>
                </Button>
            </div>

            {/* 弹出层 */}
            <Dialog
                visible={showDialog}
                title={dialogType === 'friend' ? '添加好友' : '加入群聊'}
                showCancelButton
                onConfirm={handleConfirm}
                className={"dialog"}
                onCancel={() => setShowDialog(false)}
            >
                <Input
                    value={inputValue}
                    className={"input-row"}
                    placeholder={dialogType === 'friend' ? '请输入好友名称' : '请输入群聊名称'}
                    onChange={(val) => setInputValue(val)}
                />
            </Dialog>
        </div>
    );
}
