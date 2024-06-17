import { object, string, type InferType } from "yup"

const userinfo = object({
    email: string().email("Invalid email!").required("Required!"),
    password: string()
        .min(8, "Must be at least 8 characters")
        .required("Required!"),
})

export type Userinfo = InferType<typeof userinfo>

const form: Userinfo = reactive({
    email: "",
    password: "",
})
