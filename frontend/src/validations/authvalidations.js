import * as Yup from "yup";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const passwordRules = Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/[a-z]/, "Must contain at least one lowercase letter")
    .matches(/\d/, "Must contain at least one number")
    .matches(
        /[@#$!%*?&]/,
        "Must contain at least one special character"
    );

// Login validation
export const LoginValidation = Yup.object({
    email: Yup.string()
        .required("Email is required")
        .matches(emailRegex, "Invalid Email Format"),

    password: Yup.string()
        .required("Password is required"),
});

// Signup validation
export const SignupValidation = Yup.object({
    email: Yup.string()
        .required("Email is required")
        .matches(emailRegex, "Invalid Email Format"),

    user_name: Yup.string()
        .required("User Name is required")
        .min(3, "Username must be at least 3 characters"),

    password: passwordRules,

    confirmPassword: Yup.string()
        .required("Confirm Password is required")
        .oneOf(
            [Yup.ref("password")],
            "Passwords must match"
        ),
});