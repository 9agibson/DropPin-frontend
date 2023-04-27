import React, {useState, useEffect, } from 'react';
import ReactMapGL, {Marker, Popup } from 'react-map-gl';
import {FaMapMarkerAlt} from 'react-icons/fa'
import {AiFillStar} from 'react-icons/ai'
import 'mapbox-gl/dist/mapbox-gl.css';
import './app.css'
import axios from 'axios'
import {format} from 'timeago.js'
import Register from './components/Register'
import Login from './components/Login'


export default function App() {
  const myStorage = window.localStorage;
  const [currentUser, setCurrentUser] = useState(myStorage.getItem('user'))
  const [pins, setPins] = useState([])
  const [newPlace, setNewPlace] = useState(null)
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [star, setStar] = useState(0);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [showRegister, setShowRegister] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [viewport, setViewport] = useState({
    latitude: 47.040182,
    longitude: 17.071727,
    zoom: 4,
    
  });

  const handleMarkerClick = (id, lat, long)=>{
    setCurrentPlaceId(id)
    setViewport({ ...viewport, latitude: lat, longitude: long, });
    console.log(currentPlaceId)
  }

  

  const handleAddClick = (e) => {
    const[longitude, latitude] = e.lngLat.toArray();
    setNewPlace({
      lat: latitude,
      long: longitude,
    });
    console.log(e.lngLat)
    console.log([latitude, longitude])
  };

  useEffect(()=>{
    const getPins = async ()=>{
      try{
        const res = await axios.get('http://localhost:8800/api/pins');
        setPins(res.data)
      }catch(err) {
        console.log(err)
      }
    }
    getPins();
    
  }, [])

  const handleSubmit = async (e) =>{
    e.preventDefault();
    const newPin = {
      username: currentUser,
      title,
      description,
      rating: star,
      lat: newPlace.lat,
      long: newPlace.long
    }
    try{
      const res = await axios.post("http://localhost:8800/api/pins", newPin);
      setPins([...pins, res.data]);
      setNewPlace(null)
    }catch(err) {
      console.log(err)
    }
  }

  const handleLogOut = () => {
    setCurrentUser(null)
    myStorage.removeItem("user")
  }
  
  return (
    <div className='App'>
    <ReactMapGL
      id="mymap"
      {...viewport}
      onMove={evt =>  setViewport(evt.viewState)}
      style={{width: "100vw", height: "100vh", }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      mapboxAccessToken={process.env.REACT_APP_MAPBOX}
      onDblClick = {handleAddClick}
      doubleClickZoom = {false}
      onViewportChange= {(viewport) => setViewport(viewport)}
      >
      
      {pins.map(p=>(
        <>
        <Marker  longitude={p.long} latitude={p.lat} anchor="bottom" >
        <div className='icon' onClick={() => handleMarkerClick(p._id, p.lat, p.long) }>
        <FaMapMarkerAlt  style={{color: currentUser === p.username ? 'tomato' : 'slateblue', fontSize: 20, cursor: 'pointer'}}/>
        </div>
      </Marker>
      
       {currentPlaceId === p._id && (
      <Popup 
          key={p._id}
          longitude={p.long} 
          latitude={p.lat}
          anchor="left"
          closeOnClick={false}
          onClose={() => setCurrentPlaceId(null)}
        >
        <div className='popup'>
          <label>Place</label>
          <h4 className='place'>{p.title}</h4>
          <label>Review</label>
          <p>{p.description}</p>
          <label>Rating</label>
            <div className='stars'>
              {Array(p.rating).fill(<AiFillStar/>)}
            </div>
          <label>Information</label>
          <span className='username'>Created by <b>{p.username}</b></span>
          <span className='date'>{format(p.createdAt)}</span>
        </div>
      </Popup>
      )} 
      </>
      ))}
       {newPlace && (
      <Popup 
          
          longitude={newPlace.long} 
          latitude={newPlace.lat}
          anchor="left"
          closeOnClick={false}
          onClose={() => setNewPlace(null)}
        >
          <div className='form' >
            <form onSubmit={handleSubmit}>
              <label>Title</label>
              <input placeholder='Enter a title' onChange={(e)=> setTitle(e.target.value)}></input>
              <label>Review</label>
              <textarea placeholder='Tell us about this place' onChange={(e) => setDescription(e.target.value)}></textarea>
              <label >Rating</label>
              <select onChange={(e) => setStar(e.target.value)}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
              
              <button className='add__pin' type="submit" >Add Pin</button>
            </form>
          </div>
        </Popup>)} 
        {currentUser ? (<button className='button logout' onClick={handleLogOut}>Log Out</button>) : (
          <div className='buttons'>
          <button className='button login' onClick={() => setShowLogin(true)}>Log In</button>
          <button className='button register' onClick={() => setShowRegister(true)}>register</button>
        </div>
        )}
        {showRegister && (
          <div className='register__comp'>
        <Register setShowRegister={setShowRegister}/>
        </div>
        )}
        {showLogin && (
          <div className='login__comp'>
          <Login setShowLogin={setShowLogin} setCurrentUser={setCurrentUser} myStorage={myStorage}/>
          </div>)}
          
        
    </ReactMapGL>
    
    </div>
  );
}


