import React, {useState, useRef} from 'react'
import './login.css'
import {FaMapMarkerAlt} from 'react-icons/fa'
import {AiOutlineCloseSquare} from 'react-icons/ai'
import axios from 'axios'

export default function Login({setShowLogin, setCurrentUser, myStorage}) {
    const [error, setError] = useState(false)
    const usernameRef = useRef();
    
    const passwordRef = useRef();

    const handleLogin = async (e) => {
        e.preventDefault();
        const user = {
            username: usernameRef.current.value,
            password: passwordRef.current.value
        }
        try{
            const res = await axios.post("http://localhost:8800/api/users/login", user);
            myStorage.setItem("user", res.data.username)
            setCurrentUser(res.data.username)
            setError(false)
            setShowLogin(false)
          }catch(err) {
            setError(true)
            console.log(err)
          }
    }
    

  return (
    <div className='loginContainer'>
        <div className='logo'><FaMapMarkerAlt style={{color: 'slateblue'}}/>DropPin</div>
        <form onSubmit={handleLogin}>
            <input type='text' placeholder='username' ref={usernameRef}></input>
            <input 
                type='password' 
                min='6'
                placeholder='password' 
                ref={passwordRef}
                ></input>
            <button type='submit' className='btn__register'>Log In</button>
            
            {error && (<span className='failure'>Something went wrong. Please try again.</span>)}
        </form>
        
            <AiOutlineCloseSquare className='close__btn' onClick={() => setShowLogin(false)}/>
        
    </div>
    
  )
}

