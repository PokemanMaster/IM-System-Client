import React from 'react';
import {Tabbar, TabbarItem, Badge} from 'react-vant';
import {FriendsO, ChatO, UserO} from '@react-vant/icons';
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import './layout.less';

export default function LayoutView() {
    const navigateTo = useNavigate();
    const currentRoute = useLocation();
    const IM = JSON.parse(localStorage.getItem("IM"));

    if (!IM) {
        navigateTo("/login");
    }

    // 根据当前的 pathname 设置当前选中的 tab
    const getActiveTab = () => {
        if (currentRoute.pathname.startsWith("/layout/friends")) {
            return 'friends';
        } else if (currentRoute.pathname.startsWith("/layout/group")) {
            return 'group';
        } else if (currentRoute.pathname.startsWith("/layout/personal")) {
            return 'personal';
        }
        return null;
    };

    return (
        <div className="contact-page">
            <div className="content">
                <Outlet/>
            </div>
            <Tabbar fixed value={getActiveTab()}
                    onChange={name => navigateTo(`/layout/${name}?userId=${IM.ID}&&token=${IM.Identity}`)}>
                <TabbarItem name="friends" icon={<FriendsO/>}>
                    好友
                </TabbarItem>
                <TabbarItem name="group" icon={<Badge><ChatO/></Badge>}>
                    群聊
                </TabbarItem>
                <TabbarItem name="personal" icon={<UserO/>}>
                    我的
                </TabbarItem>
            </Tabbar>
        </div>
    );
}
