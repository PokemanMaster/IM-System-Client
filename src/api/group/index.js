import request from '../index'


// 创建群聊
export const CreateCommunityAPI = (data) => {
    return request("api/v1/contact/createCommunity", {
        method: "post", data: data, credentials: 'include', // Ensure cookies are included
    });
}

// 群聊列表
export const LoadCommunityAPI = (data) => {
    return request("api/v1/contact/loadcommunity", {
        method: "post", data: data, credentials: 'include', // Ensure cookies are included
    });
}

// 加入群聊
export const JoinGroupsAPI = (data) => {
    return request("api/v1/contact/joinGroup", {
        method: "post", data: data, credentials: 'include', // Ensure cookies are included
    });
}

// 加入群聊
export const listCommunityAPI = (data) => {
    return request("api/v1/contact/listCommunity", {
        method: "post", data: data, credentials: 'include', // Ensure cookies are included
    });
}