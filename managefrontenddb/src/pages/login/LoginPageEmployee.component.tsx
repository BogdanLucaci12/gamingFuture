import Login from "../../components/loginform/Login.component"

const LoginPageEmployee = () => {
  return (
    <Login
      url="http://localhost:8626/employee/logInUser"
    role="Employee"
    />
  );
};

export default LoginPageEmployee;