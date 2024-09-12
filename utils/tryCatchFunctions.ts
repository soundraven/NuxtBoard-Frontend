import type { AxiosResponse } from "axios"

const catchError = (error: any) => {
    if (error.data && error.data.code === "E") {
        return ElMessage.error(error.data.message)
    } else {
        return ElMessage({
            message: "Unknown error occurred. Please check and try again.",
            type: "error",
        })
    }
}

const errorHandler = (result: AxiosResponse) => {
    if (result.data.code === "E" || result.data.code === "F") {
        ElMessage.error(result.data.message)
        return false
    }

    return true
}

export { catchError, errorHandler }
