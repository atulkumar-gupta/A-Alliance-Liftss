import { createContext, useContext } from 'react'

export const AuthContext = createContext({
   user: null,
   login: async () => {},
   logout: async () => {},
   signUp: async () => {},
   changePassword: async () => {},
   resetPassword: async () => {}
 })

export const useAuth = () => useContext(AuthContext)