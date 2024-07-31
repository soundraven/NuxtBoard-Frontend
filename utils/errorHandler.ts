const errorHandler = (error: any) => {
    if (error.data && error.data.code === "E") {
        alert(`errorCode: ${error.data.errorCode}, ${error.data.message}`)
    } else {
        alert("Unknown error occurred. Please check and try again.")
    }
}

export default errorHandler
