import commonAPI from "./CommonAPI";
import serverURL from "./ServerURL";



// Register path
export const registerAPI = async (reqBody) => {
    return await commonAPI("POST", `${serverURL}/register`, reqBody);
}

// Login path
export const loginAPI = async (reqBody) => {
    return await commonAPI("POST", `${serverURL}/login`, reqBody);
}
export const getAllUsersAPI = async (headers) => {
    return await commonAPI("GET", `${serverURL}/users`, null, headers);
}
export const addPostAPI = async (reqBody, headers) => {
    return await commonAPI("POST", `${serverURL}/add-post`, reqBody, headers);
}
export const getAllPostsAPI = async (headers) => {
    return await commonAPI("GET", `${serverURL}/posts`, null, headers);
};

export const getUserPostsAPI = async (id, headers) => {
    return await commonAPI("GET", `${serverURL}/posts/${id}`, null, headers);
};  

export const editPostAPI = async (id, reqBody, headers) => {
    return await commonAPI("PUT", `${serverURL}/posts/${id}`, reqBody, headers);
}

export const deletePostAPI = async (id, headers) => {
    return await commonAPI("DELETE", `${serverURL}/posts/${id}`, null, headers);
}   
export const topPostsAPI = async () => {
    return await commonAPI("GET", `${serverURL}/top-post`);
};  

export const LikePostsAPI = async (id) => {
    return await commonAPI("PUT", `${serverURL}/posts/${id}/like`);
};