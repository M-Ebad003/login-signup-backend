'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Link from 'next/link'
import { useDebugValue, useEffect, useState } from "react"
import { useDebounceValue } from 'usehooks-ts'
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios, { AxiosError } from 'axios'
import { apiResponse } from "@/types/apiResponse"

const SignIn = () => {
    const [username, setUsername] = useState('');
    const [usernameMessage, setUsernameMessage] = useState('');
    // const [loading, setLoading] = useState(false);
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const debouncedUsername = useDebounceValue(username, 300);
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: '',
            email: '',
            password: ''
        }
    })
    useEffect(() => {
        const checkUsername = async () => {
            if (debouncedUsername) {
                setIsCheckingUsername(true);
                setUsernameMessage('');
                try {
                    const response = await axios.get(`/api/checkUsername?username=${debouncedUsername}`)
                    console.log(response)
                    setUsernameMessage(response.data.message)
                } catch (error) {
                    const axiosError= error as AxiosError<apiResponse>;
                    setUsernameMessage(axiosError.response?.data.message ?? 'Error checking Username')
                } finally{
                    setIsCheckingUsername(false);
                }
            }
        }
        checkUsername();

    }, [debouncedUsername])

    return (
        <div> SignIn</div>
    )
}

export default SignIn