// export const api = async (
//     method: string,
//     path: string,
//     options: any = {}
// ): GeneralServerResponse<T> => {
//     try {
//         const res = (await $axios.request(path, {
//             method: method,
//             ...options,
//         })) as GeneralServerResponse<T>

//         return res
//     } catch (e: unknown) {
//         return e.response.data as GeneralServerResponse<T>
//     }
// }

// ///

// await api("get", "/posts/list", {
//     params: {
//         id: 123,
//     },
// })

// await api("post", "/posts/list/new", {
//     body: {
//         id: 123,
//     },
// })
