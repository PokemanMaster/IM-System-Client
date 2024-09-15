import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import "./style.less"
import {Image, Cell} from 'react-vant';
import Header from "../../components/header";
import {SearchFriendsAPI} from "../../api/friends";

export default function Cart() {
    const navigateTo = useNavigate() // 路由
    const [friends, setFriends] = useState([]); // 好友列表
    const IM = JSON.parse(localStorage.getItem("IM"));

    useEffect(() => {
        SearchFriendsAPI({
            "UserId": IM.ID,
        }).then(res => {
            setFriends(res.data)
        }).catch(err => {
            console.log(err)
        })
    }, [])


    function friendsInfo(item) {
        navigateTo(`/chat?userId=${IM.ID}&&token=${IM.Identity}`, {
            state: {
                userinfo: item
            }
        }); // 跳转到好友详情页
    }


    return (
        <>
            <Header name={"联系人"}></Header>
            <div className="friend-profile">
                {friends ? friends.map((item, index) => (<Cell
                    key={index}
                    title={item.Name}
                    onClick={() => {
                        friendsInfo(item)
                    }}
                    icon={<Image
                        src={item.Avatar}
                        round
                        width="40"
                        height="40"
                    />}
                />)) : <div></div>}
            </div>
        </>

    )
}