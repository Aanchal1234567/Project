
import React, { createContext, useState ,useEffect} from 'react';
import axios from 'axios';

const Notecontext = createContext();

export const NoteProvider = ({ children }) => {
    const [searchingitem, setSearchingitem] = useState(null);
    const [textdata, setTextdata] = useState([]);
    const [LoggedIn, setLoggedIn] = useState(false);
    const [isSignIn, setIsSignIn] = useState(true);
    const [LogedIn, setLogedIn] = useState(false);
    const [LogedInUser, setLogedInUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const id = LogedInUser?._id;
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await axios.get(`http://localhost:5500/textscontent/${id}`);
        
        if (response.data && Array.isArray(response.data)) {
          setTextdata(response.data);
          console.log(textdata)
          localStorage.setItem("textdata", JSON.stringify(textdata));
        } else if (response.data && Array.isArray(response.data.texts)) {
          setTextdata(response.data.texts);
          console.log(textdata)
          localStorage.setItem("textdata", JSON.stringify(textdata));
        } else {
          setTextdata([]);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setError("Failed to fetch tasks. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    useEffect(() => {
      const User = JSON.parse(localStorage.getItem("User"));
      if(User) {
        setLogedIn(true);
        setLogedInUser(User);
      }
    }, [LogedIn]);

    return (
        <Notecontext.Provider value={{searchingitem, setSearchingitem,fetchTasks,textdata, setTextdata,LoggedIn, setLoggedIn,LogedInUser, setLogedInUser,LogedIn, setLogedIn,isSignIn, setIsSignIn,id}}>
          {children}
        </Notecontext.Provider>
      );
    };

export default Notecontext;