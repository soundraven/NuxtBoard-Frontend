import { type AxiosResponse } from "axios"
import Cookies from "js-cookie"

interface RefreshTokenResponse {
    newAccessToken: string
}

async function refreshAccessToken(refreshToken: string): Promise<string> {
    const { $axios } = useNuxtApp()

    console.log("start")

    const response: AxiosResponse<RefreshTokenResponse> = await $axios.post(
        "/users/refreshAccessToken",
        {
            refreshToken: refreshToken,
        }
    )

    console.log(response.data)

    const newAccessToken = response.data.newAccessToken
    Cookies.set("accessToken", newAccessToken, { expires: 15 / 1440 })

    return newAccessToken
}

export default refreshAccessToken
