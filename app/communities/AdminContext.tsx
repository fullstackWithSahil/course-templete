"use client"
import { useAuth, useUser } from '@clerk/nextjs';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { 
    createContext, 
    Dispatch, 
    ReactNode, 
    SetStateAction, 
    useContext, 
    useEffect, 
    useState 
} from 'react'

export const AdminContext = createContext<{
    admins: string[];
    setBannedMembers: Dispatch<SetStateAction<string[]>>;
    setAdmins: Dispatch<SetStateAction<string[]>>;
    bannedMembers: string[]; 
}|null>(null);

export default function AdminContextProvider({children}: {children: ReactNode}){
    const [admins, setAdmins] = useState<string[]>([]);
    const [bannedMembers, setBannedMembers] = useState<string[]>([]);
    const {user} = useUser();
    const teacher = process.env.NEXT_PUBLIC_TEACHER;
    const {getToken} = useAuth();
    useEffect(()=>{
        getToken().then((token)=>{
            axios.get(
                `${process.env.NEXT_PUBLIC_WORKER_URL}/public/user/banned/teacher/${teacher}`,
                {headers:{ Authorization: `Bearer ${token}` }}
            ).then(({data})=>{
                const bannedUsers = data.data.map((user:{userId:string})=>user.userId);
                setBannedMembers(bannedUsers);
            });
            axios.get(
                `${process.env.NEXT_PUBLIC_WORKER_URL}/public/user/admin/teacher/${teacher}`,
                {headers:{ Authorization: `Bearer ${token}` }}
            ).then(({data})=>{
                const adminUsers = data.data.map((user:{id:string})=>user.id);
                setAdmins(adminUsers);
            });
        })
    },[teacher,getToken,user?.id]);
    const value ={admins,setAdmins,setBannedMembers, bannedMembers}
    return (
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    )
}

export function useAdminContext(){
    const context = useContext(AdminContext);
    if(!context){
        throw new Error("useAdminContext must be used within an AdminContextProvider");
    }
    return context;
}