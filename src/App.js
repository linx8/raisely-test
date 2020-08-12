import React from "react";
import { useForm } from "react-hook-form";
import "./App.css";

function App() {
  const { register, handleSubmit, watch, errors } = useForm({
    mode: "onBlur"
  });

  const campignUUid = "46aa3270-d2ee-11ea-a9f0-e9a68ccff42a";

  const onSubmit = async data => {
    const body = {
      data,
      campaignUuid: campignUUid
    };
    console.log(body);

    const response = await fetcher("https://api.raisely.com/v3/signup", body);

    const responseData = await response.json();

    console.log(responseData);
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

    const response = await fetcher(
      "https://api.raisely.com/v3/check-user",
      body
    );

    const responseData = await response.json();

    return responseData.data.status === "OK";
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit(onSubmit)}>
        <ul>
          <li>
            <label>First name:</label>
            <input name="firstName" ref={register({ required: true })} />
            {errors.firstName && <span>This field is required</span>}
          </li>
          <li>
            <label>Last name:</label>
            <input name="lastName" ref={register({ required: true })} />
            {errors.lastName && <span>This field is required</span>}
          </li>
          <li>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              ref={register({ required: true, validate: validateEmail })}
            />
            {errors.email && <span>email exists!</span>}
          </li>
          <li>
            <label>Password:</label>
            <input
              type="password"
              name="password"
              ref={register({ required: true })}
            />
          </li>
        </ul>
        <input type="submit" />
      </form>
    </div>
  );
}

export default App;
