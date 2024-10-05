import Login from "../../components/loginform/Login.component"

const LoginPageEmployee = () => {
  return (
    <Login
      url="https://gamingfuture-ff5d055f184c.herokuapp.com/employee/logInUser"
    role="Employee"
    />
  );
};

export default LoginPageEmployee;