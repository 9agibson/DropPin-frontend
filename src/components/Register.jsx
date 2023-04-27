import React, {useState, useRef} from 'react'
import './register.css'
import {FaMapMarkerAlt} from 'react-icons/fa'
import {AiOutlineCloseSquare} from 'react-icons/ai'
import axios from 'axios'

export default function Register({ setShowRegister }) {
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(false)
    const usernameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const serverUrl = process.env.REACT_APP_SERVER_URL

    const handleRegister = async (e) => {
        e.preventDefault();
        const newUser = {
            username: usernameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value
        }
        try{
            await axios.post(`${serverUrl}/api/users/register`, newUser);
            setError(false)
            setSuccess(true)
          }catch(err) {
            setError(true)
            console.log(err)
          }
    }



  return (
    <div className='registerContainer'>
        <div className='logo'><FaMapMarkerAlt style={{color: 'slateblue'}}/>DropPin</div>
        <form onSubmit={handleRegister}>
            <input type='text' placeholder='username' ref={usernameRef}></input>
            <input type='email' placeholder='email' ref={emailRef}></input>
            <input 
                type='password' 
                min='6'
                placeholder='password' 
                ref={passwordRef}
                ></input>
            <button type='submit' className='btn__register'>Register</button>
            {success && (<span className='success'>Successfull! Please Log In</span>)}
            {error && (<span className='failure'>Something went wrong. Please try again.</span>)}
        </form>
        
            <AiOutlineCloseSquare className='close__btn' onClick={() => setShowRegister(false)}/>
        
    </div>
  )
}

