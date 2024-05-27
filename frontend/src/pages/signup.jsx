import { BottomWarning } from "../components/bottomWarning"
import { Button } from "../components/Button"
import { Heading } from "../components/Heading"
import { InputBox } from "../components/inputBox"
import { SubHeading } from "../components/subHeading"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
export const Signup=()=>{
    const[firstName,setfirstName]=useState("")
    const[lastName,setlastName]=useState("")
    const[userName,setuserName]=useState("")
    const[password,setpassword]=useState("")
    const navigate=useNavigate()

        return <div className="bg-slate-300 h-screen flex justify-center">
    <div className="flex flex-col justify-center">
      <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
        <Heading label={"Sign up"} />
        <SubHeading label={"Enter your infromation to create an account"} />
        <InputBox onChange={(e)=>{
            setfirstName(e.target.value)
        }} placeholder="John" label={"First Name"} />
        <InputBox onChange={(e)=>{
            setlastName(e.target.value)
        }} placeholder="Doe" label={"Last Name"} />
        <InputBox onChange={(e)=>{
            setuserName(e.target.value)
        }} placeholder="harkirat@gmail.com" label={"Email"} />
        <InputBox onChange={(e)=>{
            setpassword(e.target.value)
        }} placeholder="123456" label={"Password"} />
        <div className="pt-4">
          <Button onClick={async()=>{
           try {
            const response = await axios.post('http://localhost:3000/api/v1/users/signup', {
              firstName,
              lastName,
              userName,
              password
            })
            localStorage.setItem('token', response.data.token);
            navigate('/dashboard');
          } catch (error) {
            console.log((error.response?.data?.msg || 'Signup failed'));
          }
          }} label={"Sign up"} />
        </div>
        <BottomWarning label={"Already have an account?"} buttonText={"Sign in"} to={"/signin"} />
      </div>
    </div>
  </div>
    
}