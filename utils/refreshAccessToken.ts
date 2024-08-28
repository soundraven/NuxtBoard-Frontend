import Cookies from "js-cookie";
import type { GeneralServerResponse } from "~/types/interface";

async function refreshAccessToken(
  refreshToken: string
): Promise<string | undefined> {
  const { $apiPost } = useNuxtApp();

  console.log("start");

  const response: GeneralServerResponse<{ newAccessToken: string }> =
    await $apiPost("/users/refreshAccessToken", {
      refreshToken: refreshToken,
    });

  console.log(response.data);

  const newAccessToken = response.data?.newAccessToken;
  if (newAccessToken) {
    Cookies.set("accessToken", newAccessToken, { expires: 15 / 1440 });
    return newAccessToken;
  }

  return undefined;
}

export default refreshAccessToken;
