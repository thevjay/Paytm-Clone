import axios from 'axios';
import { useEffect, useState } from 'react';

export const Balance = () => {

    const [balance, setBalance] = useState(null)
        useEffect(()=> {
            axios.get("http://localhost:8000/api/v1/account/balance", {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token"),
                        'Content-Type': 'application/json',
                    }
            }).then(function(response){
                setBalance(response.data.balance)
            })

            
        }, [balance])
     
    
    
    return (
        <div className="flex">
            <div className="font-semibold text-lg">
                Your balance:
            </div>
            <div className="font-semibold text-lg  pl-2">
                Rs {balance}
            </div>
        </div>
    );
};