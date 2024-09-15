import React, {useEffect, useState} from "react";
import "./style.less"
import {Typography} from 'antd';
import {useNavigate} from "react-router-dom";
import Header from "../../components/header";
import {Cell, Image} from "react-vant";
import {LoadCommunityAPI} from "../../api/group";

export default function Center() {
    const navigateTo = useNavigate()
    const IM = JSON.parse(localStorage.getItem("IM"));
    const [group, setGroup] = useState([])

    useEffect(() => {
        LoadCommunityAPI({
            "OwnerId": IM.ID,
        }).then(res => {
            console.log(res)
            setGroup(res.data)
        }).catch(err => {
            console.log(err)
        })
    }, [])


    function groupInfo(item) {
        navigateTo(`/gchat?userId=${IM.ID}&&token=${IM.Identity}`, {
            state: {
                groupinfo: item
            }
        }); // 跳转到好友详情页
    }

    return (
        <>
            <Header name={"群聊"}></Header>
            <div className="group-profile">

                {group ? group.map((item, index) => (
                    <Cell
                        title={item.Name}
                        key={index}
                        onClick={() => {
                            groupInfo(item)
                        }}
                        icon={<Image
                            src={item.Img}
                            round
                            width="40"
                            height="40"
                        />}
                    />
                )) : (<div></div>)}
            </div>
        </>
    )
}
