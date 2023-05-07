import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify'
import { Head, Link, router, useForm } from '@inertiajs/react';

import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import Logo from '@/Assets/logo.jpg';
import { CheckRoundIcon, CircleCross, QuestionMark } from '@/Components/Icons';
import Guide from './Guide';
// import ApplicationLogo from '@/Components/ApplicationLogo';
// import { animals } from '@/utils';


export default function Login({ app, flash, quiz, session, guest, _score }) {
    const [question, setQuestion] = useState(null)

    const [isShowGuide, setShowGuide] = useState(true)
    const [isWaitingHost, setWaitingHost] = useState(false)
    const [isShowResult, setShowResult] = useState(false)
    const [isCorrect, setCorrect] = useState(false)
    const [winner, setWinner] = useState(false)
    const [score, setScore] = useState(0)
    
    const { data, setData, post, processing, errors, reset } = useForm({
        code: '',
        // name: animals[Math.floor(Math.random()*animals.length)],
        name: '',
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
        setData('code', '')
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
        }, {
            onFinish: () => {
                const answer = question.answers.find(q => q.id === id)
                if(+answer?.is_correct === 1) {
                    setCorrect(true)
                } else {
                    setCorrect(false)
                }
            }
        })
        setWaitingHost(true)
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
        if (guest !== null) {
            setData({
                "code": session.code,
                "color": guest.color,
                "name": guest.name
            })
        }
        if(session !== null) {
            if(+session.question_present !== 0 && guest !== null) {
                console.log('check question')
                const question = quiz.questions.find(q => q.id === session.question_present)
                if(question !== null) {
                    setQuestion(question)
                }
            }
            window.Echo.channel(`hootka-${session.code}`)
                .listen("GameEvent", (e) => {
                    if(e.event === 'end') {
                        setWinner(false)
                        setShowResult(false)
                        setWaitingHost(false)
                        setQuestion(null)
                        router.post(route("player.end"))
                        toast.info("Game has been ended")
                        return
                    }
                    if(e.event === 'next') {
                        const question = quiz.questions.find(q => q.id === e.data.question_id)
                        if(question !== null) {
                            setQuestion(question)
                            setShowResult(false)
                        }
                        return
                    }
                    if(e.event === 'waiting') {
                        setWaitingHost(false)
                        setShowResult(true)
                        return
                    }
                    if(e.event === 'winner') {
                        if(+e.data === +guest.id) {
                            setWinner(true)
                        }
                        return
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
    const len = quiz?.questions.length

    return (
        <div>
            <Head title="Join" />
            {isShowGuide && (
                <Guide isOpen={isShowGuide} toggle={() => setShowGuide(!isShowGuide)} />
            )}
            {isShowResult && (
                <div className='absolute bg-gray-700 bg-opacity-95 w-full h-screen'>
                    <div className='flex w-full flex-col h-screen items-center justify-center'>
                        {isCorrect ? (
                            <>
                                <CheckRoundIcon className='w-32 h-32 text-green-600'/>
                                <div className='text-green-600 font-bold outlined-text text-4xl'>Score: {score} </div>
                            </>
                        ) : (
                            <div>
                                <CircleCross className='w-32 h-32 text-red-600'/>
                            </div>
                        )}
                        {winner && (
                            <div className='text-green-600 font-bold mt-5 outlined-text text-6xl'>WINNER #1</div>
                        )}
                        {(indexQuestion === len && quiz.answer_key_url !== null) && (
                            <a href={quiz.answer_key_url} target='_blank' className='py-2 px-4 bg-blue-600 font-bold mt-5 text-white text-1xl '>Pembahasan</a>
                        )}
                    </div>
                </div>
            )}
            {isWaitingHost && (
                <div className='absolute bg-gray-700 bg-opacity-95 w-full h-screen'>
                    <div className='flex w-full flex-col h-screen items-center justify-center'>
                        <div className='loader animate-spin'></div>
                        <div className='text-white outlined-text text-xl mt-3'>Waiting Host</div>
                    </div>
                </div>
            )}
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

            {(question === null && +session?.question_present === 0 && guest !== null) && (
                <div className='absolute bg-gray-700 bg-opacity-95 z-50 w-full h-screen'>
                    <div className='flex w-full flex-col h-screen items-center justify-center'>
                        <div className='loader animate-spin'></div>
                        <div className='text-white outlined-text text-xl mt-3'>Waiting Host</div>
                        <div 
                            className='w-32 px-5 text-center font-bold py-3 mt-10' 
                            style={{backgroundColor: data.color}}
                        >
                            {data.name}
                        </div>
                        <Link href={route("player.end")} method="post" className='btn mt-10'> Cancel </Link>
                    </div>
                </div>
            )}

            {question === null && (
                <GuestLayout>
                    <div className='mx-auto mt-5 mb-10'>
                        <Link href="/">
                            <img src={Logo} alt='app logo'/>
                        </Link>
                    </div>

                    {(session !== null && guest === null) && (
                        <form onSubmit={join} >
                            {data.name !== '' && (
                                <div 
                                    className='w-full text-center font-bold py-3' 
                                    style={{backgroundColor: data.color}}
                                    onClick={() => changeColor()}
                                >
                                    {data.name}
                                </div>
                            )}
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
                            <div 
                                className='flex items-center justify-center mt-4'
                                onClick={() => setShowGuide(!isShowGuide)}
                            >
                                <p>Petunjuk Permainan</p>
                                <div><QuestionMark/></div>
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
