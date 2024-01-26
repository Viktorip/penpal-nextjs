import { useEffect, useState } from "react";

export default function useFetch(url = '', options = {}, callback = ()=>{}, sendData = false) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(()=>{
        let active = true;

        const getData = async ()=>{
            try {
                setLoading(true);
                setError('');
                const response = await fetch(url, options);
                if (!active) return;
                if (!response.ok) {
                    setError('Something went wrong with requesting the data');
                    setLoading(false);
                    return;
                }
                const result = await response.json();
                
                setData(result);
                setLoading(false);
                sendData ? callback(result) : callback();
            }catch (err) {
                setError('Your request could not be completed');
                setLoading(false);
            }
        }

        getData();

        return () => { active = false };
    }, []);

    return [data, loading, error];
}
