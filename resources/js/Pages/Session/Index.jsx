import React, { useEffect, useRef, useState } from 'react';
import { Head, useForm, Link, router } from '@inertiajs/react';
import Goal from '@/Assets/goal.png'
import Player from '@/Assets/player.png'
import LobbyMusic from '@/Assets/lobby.mp3'
import PlayMusic from '@/Assets/quiz.mp3'
import { Muted, Unmuted } from '@/Components/Icons';

export default function Dashboard(props) {
    const { session, quiz, _answer, _result} = props
    const { data, setData } = useForm({participants: session.participants})

    const [question, setQuestion] = useState(null)
    const [timer, setTimer] = useState(0)
    const [answer, setAnswer] = useState(_answer)

    const [showResult, setShowResult] = useState(false) 

    const [audioSrc, setAudioSrc] = useState(LobbyMusic)
    const [audio, setAudio] = useState(true)
    const audioRef = useRef()

    const handleNext = () => {
        resetAudioPlay()
        let question = null

        if(+session.question_present === 0) {
            question = quiz.questions[+session.question_present]
        } else {
            const index = quiz.questions.findIndex(q => q.id === +session.question_present)
            if(index !== -1) {
                question = quiz.questions[index + 1]
            }
        }

        if(question === undefined) {
            router.post(route("quizzes.destroy", quiz))
            setQuestion(null)
            return
        }

        router.post(route("quizzes.next", quiz), {
            'question_id': question.id
        }, {
            onFinish: () => {
                setAnswer(0)
                setQuestion(question)
                setTimer(question.time)
            }
        })
    }

    const handleContinue = () => {
        resetAudioPlay()
        let question = null

        if(+session.question_present === 0) {
            question = quiz.questions[+session.question_present]
        } else {
            const index = quiz.questions.findIndex(q => q.id === +session.question_present)
            if(index !== -1) {
                question = quiz.questions[index]
            }
        }

        if(question === undefined) {
            showCurrentResult()
            setQuestion(null)
            return
        }

        router.post(route("quizzes.next", quiz), {
            'question_id': question.id
        }, {
            onFinish: () => {
                setQuestion(question)
                setTimer(question.time)
            }
        })
    }

    const showCurrentResult = () => {
        router.post(route("quizzes.result", quiz))
        audioRef.current.pause()
        setShowResult(true)
    }

    const closeResult = () => {
        handleNext()
        setShowResult(false)
    }

    const resetAudioPlay = () => {
        setAudioSrc(PlayMusic)
        audioRef.current.pause()
        audioRef.current.load()
        audioRef.current.play()
    }

    const handleAudio = () => {
        setAudio(!audio)
        if(!audio) {
            audioRef.current.play()
        } else {
            audioRef.current.pause()
        }
    }

    useEffect(() => {
        timer > 0 && setTimeout(() => {
            setTimer(timer - 1)
            if ((timer - 1) === 0) {
                showCurrentResult()
            }
        }, 1000);
    }, [timer])

    useEffect(() => {
        window.Echo.channel(`hootka-${session.code}`)
            .listen("GameEvent", (e) => {
                console.log(e)
                if(e.event === 'player-join') {
                    setData("participants", e.data)
                }
                if(e.event === 'player-answer') {
                    setAnswer(e.data)
                }
            })
            .error((error) => {
                console.error(error)
            })
        return () => {
            window.Echo.leave(`hootka-${session.code}`)
        }
    }, [])

    const indexQuestion = question === null ? 0 : quiz.questions.findIndex(q => q.id === question?.id) + 1 
    const len = quiz.questions.length

    return (
        <div className='bg-base-200 h-screen'>
            <Head title="Quiz Start" />
            <audio id="audio" loop={true} autoPlay={true} ref={audioRef}> 
                <source src={audioSrc} type="audio/mpeg"/>
            </audio>
            {showResult && (
                <div className='absolute top-0 left-0 h-screen w-full bg-gray-700 bg-opacity-90 z-30 text-white outlined-text'>
                    <div className='w-24 right-1/2 absolute top-10 bg-white p-1 text-center rounded-lg z-50 text-black'>
                        <img src={Goal} alt="goal" className='w-full'/>
                        Finish - Win
                    </div>
                    {_result.map((p) => (
                        <div 
                            key={p.id}
                            className='absolute p-1 w-20 text-center rounded-lg z-50' 
                            style={{top: p.top, right: p.right, backgroundColor: p.color}}
                        >
                            <img src={Player} alt="player" className='w-full'/>
                            {p.name}: {p.score}
                        </div>
                    ))}
                    <div className='bottom-10 right-10 absolute'>
                        <div className='btn btn-primary' onClick={closeResult}>Close</div>
                    </div>
                </div>
            )}
            {question !== null ? (
                <div className='mx-auto py-4 px-2 md:px-4'>
                    <div className='w-full flex flex-row justify-between'>
                        <div className='text-3xl font-bold'>Time: {timer}</div>
                        <div className='text-3xl font-bold'>Answer: {answer}</div>
                    </div>
                    <div className='text-6xl font-bold mx-auto w-full text-center mt-5 max-w-7xl'>
                        {question.text}
                    </div>
                    <div className='absolute bottom-20 grid grid-cols-2 w-full left-0 p-10 gap-5'>
                        {question.answers.map(answer => (
                            <div className='text-white text-center py-10 text-2xl font-bold' style={{backgroundColor: answer.color}} key={answer.id}>
                                {answer.text}
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className='mx-auto py-4 px-2 md:px-4 max-w-7xl'>
                    <div className='text-6xl font-bold mx-auto w-full text-center mt-24'>
                        Game Code : {session.code}
                    </div>

                    {data.participants.length <= 0 ? (
                        <div className='text-4xl font-semibold w-full text-center pt-2'>
                            Waiting player join...
                        </div>
                    ) : (
                        <div id="has-player">
                            <div className='w-full mx-auto flex flex-row flex-wrap justify-center mt-10'>
                                {data.participants.map(p => (
                                    <div 
                                        className='text-xl font-bold border-4 px-5 py-2 outlined-text text-white' 
                                        style={{backgroundColor: p.color}}
                                        key={p.id}
                                    >
                                            {p.name}
                                    </div>
                                ))}
                            </div>

                            <div className='w-full flex flex-row justify-center mt-20'>
                                {+session.question_present === 0 ? (
                                    <div 
                                        className='btn btn-primary'
                                        onClick={() => handleNext()}
                                    >
                                        Start
                                    </div>
                                ) : (
                                    <div 
                                        className='btn btn-primary'
                                        onClick={() => handleContinue()}
                                    >
                                        Continue
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
            <div className='absolute bottom-0 shadow-lg w-full p-4 bg-base-100'>
                <div className='flex flex-row w-full justify-between font-bold'>
                    <div>{indexQuestion}/{len}</div>
                    <div className='flex flex-row gap-2 items-center'>
                        <div className='btn btn-outline btn-sm' onClick={() => handleAudio()}>
                            {audio ? (
                                <Unmuted/>
                            ) : (
                                <Muted/>
                            )}
                        </div>
                        <div className='mr-5'>Game Code : {session.code}</div>
                        <div className='btn btn-outline btn-sm' onClick={() => handleNext()}>Skip</div>
                        <Link href={route("quizzes.destroy", session.quiz_id)} method="post" className='btn btn-outline btn-sm'>End</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
