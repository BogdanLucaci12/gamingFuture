import { LoginFormContainer } from "../container/CardContainer.styles";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label";

const LoginForm = () => {
    return (
        <LoginFormContainer>
            <form action="">
                <div className="p-3">
                    <Label htmlFor="username">Username</Label>
                    <Input
                        id="username"
                        type="text"
                        placeholder="Username"
                        autoComplete="off"
                    />
                </div>
                <div className="p-3">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="Password"
                    />
                </div>
                <div className="flex justify-end">
                    <Button className="">Submit</Button>
                </div>
            </form>
        </LoginFormContainer>
    );
};

export default LoginForm;