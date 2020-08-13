import React, { useState } from "react";
import { useForm } from "react-hook-form";
import "./App.scss";

function App() {
  const { register, handleSubmit, errors } = useForm({
    mode: "all"
  });

  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const campignUUid = "46aa3270-d2ee-11ea-a9f0-e9a68ccff42a";

  const onSubmit = async data => {
    const body = {
      data,
      campaignUuid: campignUUid
    };

    setSubmitting(true);

    const response = await fetcher("https://api.raisely.com/v3/signup", body);

    if (response.status === 400) {
      setStatus("Error on signup, check your details and try again.");
    }

    if (response.status === 200) {
      const responseData = await response.json();

      // lets assume this means success
      if (responseData.data) setStatus("Signup successful, Congrats!");
    }

    setSubmitting(false);
    setTimeout(() => {
      // Clear status after sometime
      setStatus(null);
    }, 5000);
  };

  const fetcher = async (url, data) => {
    return await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8"
      },
      body: JSON.stringify(data)
    });
  };

  const validateEmail = async email => {
    const body = {
      data: {
        email
      },
      campaignUuid: campignUUid
    };

    // TODO: Check if email is a valid email address
    // return "Please enter a valid email address;

    const response = await fetcher(
      "https://api.raisely.com/v3/check-user",
      body
    );

    const responseJSON = await response.json();

    if (responseJSON.data.status === "EXISTS")
      return "Email already registered.";

    return responseJSON.data.status === "OK";
  };

  return (
    <div className="App">
      <h1 className="c-title">Signup.</h1>
      <form className="c-form" onSubmit={handleSubmit(onSubmit)}>
        <ul className="c-form__fields">
          <li>
            <label className="u-hidden">First name:</label>
            <input
              autoFocus={true}
              placeholder="First name"
              invalid={errors.firstName && "true"}
              name="firstName"
              ref={register({ required: true })}
            />
            {errors.firstName && (
              <span className="c-error">This field is required</span>
            )}
          </li>
          <li>
            <label className="u-hidden">Last name:</label>
            <input
              placeholder="Last name"
              invalid={errors.lastName && "true"}
              name="lastName"
              ref={register({ required: true })}
            />
            {errors.lastName && (
              <span className="c-error">This field is required</span>
            )}
          </li>
          <li>
            <label className="u-hidden">Email:</label>
            <input
              placeholder="Email"
              invalid={errors.email && "true"}
              type="email"
              name="email"
              ref={register({ required: true, validate: validateEmail })}
            />

            {errors.email && (
              <span className="c-error">
                {errors.email.message || "This field is required"}
              </span>
            )}
          </li>
          <li>
            <label className="u-hidden">Password:</label>
            <input
              placeholder="Password"
              invalid={errors.password && "true"}
              type="password"
              name="password"
              ref={register({ required: true })}
            />
            {errors.password && (
              <span className="c-error">
                {errors.password.message || "This field is required"}
              </span>
            )}
          </li>
        </ul>

        <p>
          <button
            disabled={submitting || Object.keys(errors).length !== 0}
            className="c-submit"
            type="submit"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </p>
        {status && <p>{status}</p>}
      </form>
    </div>
  );
}

export default App;
