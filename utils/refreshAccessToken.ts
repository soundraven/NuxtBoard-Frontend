import axios, { type AxiosResponse } from "axios"
import Cookies from "js-cookie"

interface RefreshTokenResponse {
    newAccessToken: string
}

async function refreshAccessToken(refreshToken: string): Promise<string> {
    const { $indexStore } = useNuxtApp()

    try {
        const response: AxiosResponse<RefreshTokenResponse> = await axios.post(
            "/users/refreshToken",
            {
                refreshToken: refreshToken,
            }
        )

        const newAccessToken = response.data.newAccessToken

        Cookies.set("accessToken", newAccessToken)

        return newAccessToken
    } catch (error) {
        ElMessage.error("Failed to refresh access token. Please log in again.")
        $indexStore.auth.logout()

        return Promise.reject(error)
    }
}

export default refreshAccessToken
