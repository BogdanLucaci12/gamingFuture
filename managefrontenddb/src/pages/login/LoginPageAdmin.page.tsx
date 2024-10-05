
import Login from "@/components/loginform/Login.component";

const LoginPageAdmin = () => {

    return (
       <Login
            url="https://gamingfuture-ff5d055f184c.herokuapp.com/admin/loginAdmin"
            role='Admin'
       />
    );
};

export default LoginPageAdmin;