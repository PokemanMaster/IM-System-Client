import request from '../index'

export const SendUserMsgAPI = (data) => {
    return request("api/v1/user/sendUserMsg", {
        method: "post", data: data, credentials: 'include', // Ensure cookies are included
    });
}

export const SendMsgAPI = () => {
    return request("api/v1/user/sendMsg", {
        method: "get",
    });
}

export const RedisMsgAPI = (data) => {
    return request("api/v1/user/redisMsg", {
        method: "post", data: data
    });
}