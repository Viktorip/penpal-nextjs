import { useEffect, useState } from "react";



export default function useValidate(value = '', options = { type: 'text', min, max }) {
    const [isValid, setIsValid] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const checkValue = () => {
            switch (options.type) {
                case 'text':
                    const text = validateText(value);
                    if (!text) {
                        setIsValid(false);
                        setError({ message: 'Only special characters allowed are ! ? .' });
                        return;
                    }
                    if (options.min) {
                        const longEnough = !!(value.length >= options.min);
                        if (!longEnough) {
                            setIsValid(false);
                            setError({ message: `Text input must be at least ${options.min} characters long!` });
                            return;
                        }
                    }
                    if (options.max) {
                        const shortEnough = !!(value.length < options.max);
                        if (!shortEnough) {
                            setIsValid(false);
                            setError({ message: `Text input must be less than ${options.max} characters long!` });
                            return;
                        }
                    }
                    setIsValid(true);
                    setError(null);
                    break;
                case 'email':
                    const email = validateEmail(value);
                    if (!email) {
                        setIsValid(false);
                        setError({message:'Not a valid email!'});
                        return;
                    }
                    setIsValid(true);
                    setError(null);
                    break;
                case 'password':
                    const pass = validatePassword(value);
                    if (!pass) {
                        setIsValid(false);
                        setError({ message: 'Password must contain small letter, big letter, number and special character!' });
                        return;
                    }
                    if (options.min) {
                        const longEnough = !!(value.length >= options.min);
                        if (!longEnough) {
                            setIsValid(false);
                            setError({ message: `Password must be at least ${options.min} characters long!` });
                            return;
                        }
                    }
                    if (options.max) {
                        const shortEnough = !!(value.length < options.max);
                        if (!shortEnough) {
                            setIsValid(false);
                            setError({ message: `Password must be less than ${options.max} characters long!` });
                            return;
                        }
                    }
                    setIsValid(true);
                    setError(null);
                    break;
                default:
                    console.log('No type defined in validate');
                    break;
            }
        }

        checkValue();
    }, [value]);

    return [isValid, error];
}

const validateEmail = (email) => {
    let valid = false;
    const regex = /^[a-z0-9_]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|fi|org|net|gov|info)$/;
    valid = regex.test(email);
    return valid;
};

const validateText = (txt) => {
    let valid = false;
    const regex = /^[a-zA-Z0-9\s!?\.]*$/; // /^[a-zA-Z][a-zA-Z0-9_-]{0,}$/;
    valid = regex.test(txt);
    return valid;
}

const validateNumber = (num) => {
    let valid = false;
    const regex = /^[0-9]{1,}$/;
    valid = regex.test(num);
    return valid;
}

const validatePassword = (pass) => {
    let valid = false;
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_-])[A-Za-z\d@$!%*?&_-]{1,}$/;
    valid = regex.test(pass);
    return valid;
}