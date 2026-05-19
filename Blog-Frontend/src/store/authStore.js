import axios from 'axios'
import {create} from 'zustand'

const BACKEND_URL = import.meta.env.VITE_API_URL

export const useAuth=create((set)=>({

    loading:false,

    error:null,

    userAuthenticate:false,

    currentUser:null,

    login:async(userCredWithRole)=>{

       const {role,...userCredObj}=userCredWithRole

       try{

       //set loading true
       set({
        loading:true,
        error:null
       })

       //make api call
       let res=await axios.post(
        `${BACKEND_URL}/common-api/login`,
        userCredObj,
        {withCredentials:true}
       )

       console.log("res is",res)

       //update the state
        set({
            loading:false,
            userAuthenticate:true,
            currentUser:res.data.payload
        })

        }catch(err){

         console.log("err is",err)

         set({
            loading:false,
            userAuthenticate:false,
            currentUser:null,
            error:err.response?.data?.error || "Login Failed"
         })
        }
    },

    logout:async()=>{

        try{

            //set loading state
            set({
              loading:true,
              error:null
            })

            //make logout api req
            await axios.get(
              `${BACKEND_URL}/common-api/logout`,
              {withCredentials:true}
            )

            //update state
            set({
              loading:false,
              userAuthenticate:false,
              currentUser:null
            })

        }catch(err){

            set({
              loading:false,
              userAuthenticate:false,
              currentUser:null,
              error:err.response?.data?.error || "Logout Failed"
            })
        }
    },

    //restore login state on page refresh
    checkAuth: async () => {

      try {

        set({ loading: true });

        const res = await axios.get(
          `${BACKEND_URL}/common-api/check-auth`,
          { withCredentials: true }
        );

        set({
          currentUser: res.data.payload,
          userAuthenticate: true,
          loading: false,
        });

      } catch (err) {

        // If user is not logged in or token expires/invalid
        if (
          err.response?.status === 401 ||
          err.response?.status === 403 ||
          err.response?.status === 400
        ) {

          set({
            currentUser: null,
            userAuthenticate: false,
            loading: false,
          });

          return;
        }

        // other errors
        console.error("Auth check failed:", err);

        set({ loading: false });
      }
    }

}))

export default useAuth