import type { FormRules } from "element-plus";

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
      validator: (rule, value: string, callback) => {
        if (
          value.length < 8 ||
          !/[A-Z]/.test(value) ||
          !/[a-z]/.test(value) ||
          !/[!@#$%^&*(),.?":{}|<>]/.test(value)
        ) {
          callback(new Error("The id or password is incorrect."));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],

  userName: [
    {
      validator: (rule, value: string, callback) => {
        if (!value) {
          callback();
          return;
        }

        if (value.length > 12) {
          callback(new Error("User name must be at most 12 characters"));
          return;
        }

        if (!/^[ㄱ-ㅎ가-힣a-zA-Z0-9]+$/.test(value)) {
          callback(new Error("Special characters are not allowed"));
          return;
        }

        if (/\s/.test(value)) {
          callback(new Error("User name must not contain spaces"));
          return;
        }

        callback();
      },
      trigger: "blur",
    },
  ],
};

export default rules;
