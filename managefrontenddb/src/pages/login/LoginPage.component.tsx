
import LoginForm from "@/components/loginform/LoginForm.component";
import { LoginContainer } from "./Login.styles";
import { DarkButton } from "@/components/button/Button.styles";

const Login = () => {
    return (
        <LoginContainer>
            <LoginForm/>
            <DarkButton className="absolute self-end bottom-2 right-2" padding="0 3em">
                <b>
                Admin
                </b>
                </DarkButton>
        </LoginContainer>
    );
};

export default Login;