import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify'
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, router, useForm } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { animals } from '@/utils';

export default function Login({ app, flash, quiz, session, guest, _score }) {
    const [question, setQuestion] = useState(null)

    const [score, setScore] = useState(0) 
    
    const { data, setData, post, processing, errors, reset } = useForm({
        code: '',
        name: animals[Math.floor(Math.random()*animals.length)],
        color: '#'+Math.floor(Math.random()*16777215).toString(16)
    });

    const changeColor = () => {
        setData("color", '#'+Math.floor(Math.random()*16777215).toString(16))
    }

    const onHandleChange = (event) => {
        setData(event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('player.code'))
        reset()
    };
    
    const join = (e) => {
        e.preventDefault();
        post(route('player.join'))
        reset()
    };

    const submitAnswer = (id) => {
        router.post(route('player.answer'), {
            answer: id
        })
    }
    
    useEffect(() => {
        setScore(_score)
    }, [_score])

    useEffect(() => {
        if (flash.message !== null) {
            toast(flash.message.message, {type: flash.message.type})
        }
    }, [flash])

    useEffect(() => {
        console.log('render')
        if (guest !== null) {
            setData({
                "code": session.code,
                "color": guest.color,
                "name": guest.name
            })
        }
        if(session !== null) {
            console.log('subscribe', session)
            if(+session.question_present !== 0 && guest !== null) {
                console.log('check question')
                const question = quiz.questions.find(q => q.id === session.question_present)
                if(question !== null) {
                    setQuestion(question)
                }
            }
            window.Echo.channel(`hootka-${session.code}`)
                .listen("GameEvent", (e) => {
                    console.log(e)
                    if(e.event === 'end') {
                        setQuestion(null)
                        router.post(route("player.end"))
                        toast.info("Game has been ended")
                        return
                    }
                    if(e.event === 'next') {
                        console.log(e.data.question_id)
                        const question = quiz.questions.find(q => q.id === e.data.question_id)
                        if(question !== null) {
                            setQuestion(question)
                        }
                    }
                })
                .error((error) => {
                    console.error(error)
                })
            return () => {
                window.Echo.leave(`hootka-${session.code}`)
            }
        }
    }, [session, guest])

    const indexQuestion = question === null ? 0 : quiz.questions.findIndex(q => q.id === question?.id) + 1 
    const len = quiz.questions.length

    return (
        <div>
            <Head title="Join" />

            {question !== null && (
                <div className='w-full h-screen'>
                    <div 
                        className='w-full flex flex-row font-bold p-3 justify-between outlined-text text-white'
                        style={{backgroundColor: data.color}}
                    >
                        <div>{data.name}</div>
                        <div>{indexQuestion}/{len}</div>
                        <div>Score : {score}</div>
                    </div>
                    <div className='grid grid-cols-2 w-full gap-4 p-4 h-max'>
                        {question.answers.map(answer => (
                            <div 
                                className='btn text-white text-center items-center py-10 px-5 text-2xl font-bold w-full h-72' 
                                style={{backgroundColor: answer.color}} 
                                key={answer.id}
                                onClick={() => submitAnswer(answer.id)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {question === null && (
                <GuestLayout>
                    <div className='mx-auto mt-5 mb-10'>
                        <Link href="/">
                            <ApplicationLogo className="font-bold text-2xl">
                                {app.name}
                            </ApplicationLogo>
                        </Link>
                    </div>
                    

                    {(+session?.question_present === 0 && guest !== null) && (
                        <>
                            <div 
                                className='w-full text-center font-bold py-3' 
                                style={{backgroundColor: data.color}}
                            >
                                {data.name}
                            </div>
                            <div className='loading btn btn-outline mt-3'>
                                Waiting Host
                            </div>
                            <Link href={route("player.end")} method="post" className='btn mt-10'> Cancel </Link>
                        </>
                    )}

                    {(session !== null && guest === null) && (
                        <form onSubmit={join} >
                            <div 
                                className='w-full text-center font-bold py-3' 
                                style={{backgroundColor: data.color}}
                                onClick={() => changeColor()}
                            >
                                {data.name}
                            </div>
                            <div className='pt-2'>
                                <InputLabel forInput="code" value="Name" />

                                <TextInput
                                    type="text"
                                    name="name"
                                    value={data.name}
                                    className="mt-1 block w-full"
                                    isFocused={true}
                                    handleChange={onHandleChange}
                                />

                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div className="flex items-center justify-center mt-4">
                                <PrimaryButton className="ml-4" processing={processing}>
                                    Join
                                </PrimaryButton>
                                
                            </div>
                        </form>
                    )}

                    {session === null && (
                        <form onSubmit={submit}>
                            <div>
                                <InputLabel forInput="code" value="Code" />

                                <TextInput
                                    type="text"
                                    name="code"
                                    value={data.code}
                                    className="mt-1 block w-full"
                                    isFocused={true}
                                    handleChange={onHandleChange}
                                />

                                <InputError message={errors.code} className="mt-2" />
                            </div>

                            <div className="flex items-center justify-center mt-4">
                                <PrimaryButton className="ml-4" processing={processing}>
                                    Join
                                </PrimaryButton>
                                
                            </div>
                        </form>
                    )}
                </GuestLayout>
            )}
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    );
}
