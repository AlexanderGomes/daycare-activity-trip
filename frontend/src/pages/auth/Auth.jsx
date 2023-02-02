import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { register, login, reset } from "../../features/auth/authSlice";
import { useFormik } from "formik";
import "./Auth.css";

const Auth = () => {
  const [takenEmail, setTakenEmail] = useState(false);
  const emailTakenMessage = "Request failed with status code 400";

  const [wrongEmail, setWrongEmail] = useState(false);
  const wrongEmailMessage = "Request failed with status code 405";

  const [wrongPass, setWrongPass] = useState(false);
  const wrongPasswordMessage = "Request failed with status code 402";

  const [isRegister, setIsRegister] = useState(false);

  const { user, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      password2: "",
    },

    onSubmit: (values) => {
      const userDataLogin = {
        email: values.email,
        password: values.password,
      };
      const userDataRegister = {
        name: values.name,
        email: values.email,
        password: values.password,
      };
      if (isRegister === true) {
        dispatch(register(userDataRegister));
      } else {
        dispatch(login(userDataLogin));
      }
    },
  });

  useEffect(() => {
    if (formik.errors.email) {
      setTakenEmail(false);
    }

    if (isError && message === emailTakenMessage) {
      setTakenEmail(true);
    }

    if (isError && message === wrongPasswordMessage) {
      setWrongPass(true);
    }

    if (isError && message === wrongEmailMessage) {
      setWrongEmail(true);
    }

    if (isSuccess || user) {
      navigate("/c/feed");
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, formik]);

  const handleChangeForm = () => {
    setIsRegister(!isRegister);
    setTakenEmail(false);
    setWrongEmail(false);
    setWrongPass(false);
    formik.resetForm();
  };

  return (
    <div className="register__color">
      <div className="register__main">
        <div className="register__form__color">
          <div className="register__form__main">
            <div className="register__title">
              <p>Social Trip</p>
            </div>

            <form className="inputs" onSubmit={formik.handleSubmit}>
              {isRegister === false ? (
                <>
                  <input
                    className="input"
                    type="email"
                    id="email"
                    name="email"
                    placeholder="example@test.com"
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    onChange={formik.handleChange}
                  />
                  {wrongEmail === true ? (
                    <p className="error">wrong email</p>
                  ) : (
                    ""
                  )}

                  <input
                    className="input"
                    id="password"
                    name="password"
                    type="password"
                    placeholder="password min 8 charaters long"
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                  />
                  {wrongPass === true ? (
                    <p className="error">wrong password</p>
                  ) : (
                    ""
                  )}
                  <button className="register__btn" type="submit">
                    LOGIN
                  </button>
                </>
              ) : (
                <>
                  <input
                    className="input"
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Name"
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                    onChange={formik.handleChange}
                  />

                  <input
                    className="input"
                    type="email"
                    id="email"
                    name="email"
                    placeholder="example@test.com"
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    onChange={formik.handleChange}
                  />
                  {takenEmail === true ? (
                    <p className="error">Email is Taken</p>
                  ) : (
                    ""
                  )}

                  <input
                    className="input"
                    id="password"
                    name="password"
                    type="password"
                    placeholder="password min 8 charaters long"
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                  />

                  <input
                    className="input"
                    id="password2"
                    name="password2"
                    type="password"
                    placeholder="password min 8 charaters long"
                    onBlur={formik.handleBlur}
                    value={formik.values.password2}
                    onChange={formik.handleChange}
                  />

                  <button className="register__btn" type="submit">
                    REGISTER
                  </button>
                </>
              )}
            </form>

            <div className="register__link">
              <>
                {isRegister === false ? (
                  <>
                    <p className="register__question">
                      Don't have an account?{" "}
                    </p>
                    <p
                      className="register__q__switch"
                      onClick={handleChangeForm}
                    >
                      Register
                    </p>
                  </>
                ) : (
                  <>
                    <p className="register__question">
                      Already have an account?{" "}
                    </p>
                    <p
                      className="register__q__switch"
                      onClick={handleChangeForm}
                    >
                      Login
                    </p>
                  </>
                )}
              </>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
