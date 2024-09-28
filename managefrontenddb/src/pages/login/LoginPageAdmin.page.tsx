
import Login from "@/components/loginform/Login.component";

const LoginPageAdmin = () => {

    return (
       <Login
            url="http://localhost:8626/admin/loginAdmin"
            role='Admin'
       />
    );
};

export default LoginPageAdmin;