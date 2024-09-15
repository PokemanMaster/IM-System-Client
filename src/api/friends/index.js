import request from '../index'


// 添加好友
export const AddFriendAPI = (data) => {
    return request("api/v1/contact/addfriend", {
        method: "post", data: data, credentials: 'include', // Ensure cookies are included
    });
}

// 寻找好友
export const FindByIDAPI = (data) => {
    return request("api/v1/user/find", {
        method: "post", data: data, credentials: 'include', // Ensure cookies are included
    });
}

// 搜索好友
export const SearchFriendsAPI = (data) => {
    return request("api/v1/search/friends", {
        method: "post", data: data, credentials: 'include', // Ensure cookies are included
    });
}