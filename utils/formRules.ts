import type { FormInstance, FormRules } from "element-plus"

const rules: FormRules = {
    email: [
        { required: true, message: "Please input your email", trigger: "blur" },
        {
            type: "email",
            message: "Please input a valid email",
            trigger: "blur",
        },
    ],

    password: [
        {
            required: true,
            message: "Please input your password",
            trigger: "blur",
        },
        {
            validator: (rule, value, callback) => {
                if (value.length < 8) {
                    callback(
                        new Error("Password must be at least 8 characters")
                    )
                } else if (!/[A-Z]/.test(value)) {
                    callback(
                        new Error(
                            "Password must contain at least one uppercase letter"
                        )
                    )
                } else if (!/[a-z]/.test(value)) {
                    callback(
                        new Error(
                            "Password must contain at least one lowercase letter"
                        )
                    )
                } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
                    callback(
                        new Error(
                            "Password must contain at least one special character"
                        )
                    )
                } else {
                    callback()
                }
            },
            trigger: "change",
        },
    ],

    username: [
        {
            validator: (rule, value, callback) => {
                if (value && value.length < 3) {
                    callback(
                        new Error("Username must be at least 3 characters")
                    )
                } else if (value && !/^[a-zA-Z0-9]+$/.test(value)) {
                    callback(
                        new Error(
                            "Username must contain only alphanumeric characters"
                        )
                    )
                } else {
                    callback()
                }
            },
            trigger: "blur",
        },
    ],
}

export default rules
