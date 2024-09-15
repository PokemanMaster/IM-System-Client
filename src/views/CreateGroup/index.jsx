import React, {useState, useRef} from "react";
import {Button, Cell, Field, Image} from "react-vant";
import "./style.less";
import {CreateCommunityAPI} from "../../api/group";
import Header from "../../components/header";

export default function CreateGroup() {
    const [groupName, setGroupName] = useState("");
    const [groupDesc, setGroupDesc] = useState("");
    const [image, setImage] = useState(null);
    const fileInputRef = useRef(null); // 使用ref引用文件输入框
    const IM = JSON.parse(localStorage.getItem("IM"));
    // 处理图片上传
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(URL.createObjectURL(file)); // 使用本地文件创建预览 URL
        }
    };

    // 头像点击事件，模拟点击文件输入框
    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const handleSubmit = () => {
        CreateCommunityAPI({
            OwnerId: IM.ID,
            Name: groupName,
            Icon: "djkawhndjkawdhnawkjndawk",
            Desc: groupDesc,
        }).then(res => {
            console.log(res)
        }).catch(err => {
            console.log(err)
        })
    };

    return (
        <>
            <Header name={"创建群聊"}></Header>
            <div className={"create-group"}>

                <div className="create-group-container">
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef} // 绑定文件输入框的ref
                        onChange={handleImageUpload} // 当用户选择文件时调用
                        style={{display: "none"}} // 完全隐藏文件输入框
                    />

                    {/* 名称 */}
                    <Field
                        label="名称"
                        placeholder="请输入群名称"
                        value={groupName}
                        onChange={(val) => setGroupName(val)}
                    />

                    {/* 介绍 */}
                    <Field
                        label="介绍"
                        placeholder="群描述"
                        value={groupDesc}
                        onChange={(val) => setGroupDesc(val)}
                    />

                    {/* 确认按钮 */}
                    <div className="submit-button">
                        <Button type="danger" block onClick={handleSubmit}>
                            确认
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
