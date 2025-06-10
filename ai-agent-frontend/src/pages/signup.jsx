import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [form , setForm] = useState({email: "" , passowrd: ""});
  const [loading , setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({...form , [e.target.name]: e.target.value});
  }

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_SREVER_URL}/auth/signup` , {
        method: "POST",
        headers: {
          "Content-Type" : "application/json"
        },
        body: JSON.stringify()
      })
      const data = res.json();
      if(res.ok) {
        localStorage.setItem("token" , data.token);
        localStorage.setItem("user" , JSON.stringify(data.user));
        navigate("/");
      } else {
        alert(data.message || "SignUp Failed");
      }
    } catch (error) {
      alert("Signup - Something went wrong");
    }

    finally {
      setLoading(false);
    }
  }
  return (
    <div>
      
    </div>
  )
}

export default Signup
