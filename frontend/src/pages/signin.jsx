import { BottomWarning } from "../components/bottomWarning";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/inputBox";
import { SubHeading } from "../components/subHeading";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Signin = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignin = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post('http://localhost:3000/api/v1/users/signin', {
        userName,
        password
      });
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || "Error signing in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading label={"Sign in"} />
          <SubHeading label={"Enter your credentials to access your account"} />
          <InputBox 
            onChange={(e) => setUserName(e.target.value)} 
            placeholder="harkirat@gmail.com" 
            label={"Email"} 
          />
          <InputBox 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="123456" 
            label={"Password"} 
            type="password"
          />
          {error && <div className="text-red-500 mt-2">{error}</div>}
          <div className="pt-4">
            <Button onClick={handleSignin} label={"Sign in"} disabled={loading} />
          </div>
          <BottomWarning label={"Don't have an account?"} buttonText={"Sign up"} to={"/signup"} />
        </div>
      </div>
    </div>
  );
};
