const { prompt } = require("prompts");
const Authenticator = require("./authenticator");

(async () => {
  const { action } = await prompt({
    type: "select",
    name: "action",
    message: "Please login (or register if you haven't registered yet)",
    choices: [
      { title: "Login", value: "login" },
      { title: "Register", value: "register" }
    ]
  });

  switch (action) {
    case "login": {
      const questions = [
        {
          type: "text",
          name: "user",
          message: "User",
          validate: input => Boolean(input) || "Provide user name"
        },
        {
          type: "password",
          name: "password",
          message: "Password",
          validate: input => Boolean(input) || "Provide password"
        }
      ];

      const { user, password } = await prompt(questions);

      try {
        const isLoggedIn = await Authenticator.login({ user, password });

        if (isLoggedIn) {
          console.log("✔️  Success");
        } else {
          console.log("❌  Wrong login or password");
        }
      } catch (error) {
        console.error(error.message);
      }

      break;
    }
    case "register": {
      const questions = [
        {
          type: "text",
          name: "firstName",
          message: "First name"
        },
        {
          type: "text",
          name: "lastName",
          message: "Last name"
        },
        {
          type: "text",
          name: "user",
          message: "User name (nickname)",
          validate: input =>
            (Boolean(input) && input.length >= 4) ||
            "Provide user name (minimum length: 4 chars)"
        },
        {
          type: "password",
          name: "password",
          message: "Password",
          validate: input =>
            (Boolean(input) && input.length >= 4) ||
            "Provide password (minimum length: 4 chars)"
        }
      ];

      const { firstName, lastName, user, password } = await prompt(questions);

      try {
        const isRegistered = await Authenticator.register({
          firstName,
          lastName,
          user,
          password
        });

        if (isRegistered) {
          console.log("✔️  Success");
        } else {
          console.log("❌  The error is in input data. Try one more time");
        }
      } catch (error) {
        console.error(error.message);
      }

      break;
    }
  }
})();
