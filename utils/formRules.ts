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
        if (value.length < 8) {
          callback(new Error("Password must be at least 8 characters"));
        } else if (!/[A-Z]/.test(value)) {
          callback(
            new Error("Password must contain at least one uppercase letter")
          );
        } else if (!/[a-z]/.test(value)) {
          callback(
            new Error("Password must contain at least one lowercase letter")
          );
        } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
          callback(
            new Error("Password must contain at least one special character")
          );
        } else {
          callback();
        }
      },
      trigger: "change",
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
