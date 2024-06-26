import { useState } from "react";
import HTTPClient from "../../Utils/HTTPClient";
import { useNavigate } from "react-router-dom";

import styles from "./RegisterForm.module.css";

const RegisterForm = (props) => {
    const [data, setData] = useState({});
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (event) => {
        setData({
            ...data,
            [event.target.name]: event.target.value,
        });
    };

    const validate = () => {
        let flag = true;
        let errors = {};

        if (!data.name || data.name.lenght <= 5) {
            errors.name = "The name is required";
            flag = false;
        }

        if (data.password.lenght <= 5) {
            errors.password = "The password must be at least 5 characters long";
            flag = false;
        }

        if (
            data.password &&
            data.password2 &&
            data.password !== data.password2
        ) {
            errors.password = "The passwords do not match";
            flag = false;
        }
        setErrors(errors);
        return flag;
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!validate()) {
            return;
        }

        let client = new HTTPClient();

        client
            .register(data)
            .then((response) => {
                localStorage.setItem("userName", response.data.user.name);
                navigate("/events");
            })
            .catch((error) => {
                if (error.response) {
                    setErrors(error.response.data.errors);
                }
                console.log(error);
            });
    };

    return (
        <div className={styles.registerContainer}>
            <form onSubmit={handleSubmit} className={styles.registerForm}>
                <h1>Register</h1>
                <div>
                    {errors.name && (
                        <small className={styles.registerFormError}>
                            {errors.name}
                        </small>
                    )}
                    <label htmlFor="name">Name</label>
                    <input
                        id="name"
                        type="name"
                        name="name"
                        value={data.name || ""}
                        onChange={handleChange}
                        required={true}
                    />
                </div>
                <div>
                    {errors.email && (
                        <small className={styles.registerFormError}>
                            {errors.email}
                        </small>
                    )}
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email || ""}
                        onChange={handleChange}
                        required={true}
                    />
                </div>
                <div>
                    {errors.password && (
                        <small className={styles.registerFormError}>
                            {errors.password}
                        </small>
                    )}
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password || ""}
                        onChange={handleChange}
                        required={true}
                        minLength={5}
                    />
                </div>
                <div>
                    <label htmlFor="password2">Confirm password</label>
                    {errors.password2 && (
                        <small className={styles.registerFormError}>
                            {errors.password2}
                        </small>
                    )}
                    <input
                        id="password2"
                        type="password"
                        name="password2"
                        value={data.password2 || ""}
                        onChange={handleChange}
                        required={true}
                        minLength={5}
                    />
                </div>
                <div>
                    <button>Registro</button>
                </div>
                <p>
                    or sing in
                    <br />
                    <a href="/login">LogIn Page</a>
                </p>
            </form>
        </div>
    );
};

export default RegisterForm;
