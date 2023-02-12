import React, { useEffect, useState } from 'react';
import { Head, useForm, Link, router } from '@inertiajs/react';

export default function Dashboard(props) {
    const { session, quiz } = props
    const { data, setData } = useForm({
        participants: session.participants
    })

    const [question, setQuestion] = useState(null)
    const [timer, setTimer] = useState(0)

    const handleNext = () => {
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
            console.log('pertanyaan habis')
            setQuestion(null)
            return
        }

        setQuestion(question)
        router.post(route("quizzes.next", quiz), {
            'question_id': question.id
        })
    }

    useEffect(() => {
        if(question !== null) {
            setTimer(question.time)
        }
    }, [question])

    useEffect(() => {
        timer > 0 && setTimeout(() => {
            setTimer(timer - 1)
            if ((timer - 1) === 0) {
                // tmp
                handleNext()
                // TODO: handle show result
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
            })
            .error((error) => {
                console.error(error)
            })
        return () => {
            window.Echo.leave(`hootka-${session.code}`)
        }
    }, [])

    const action = +session.question_present !== 0 ? 'Continue' : 'Start'
    const indexQuestion = question === null ? 0 : quiz.questions.findIndex(q => q.id === question?.id) + 1 
    const len = quiz.questions.length

    return (
        <div className='bg-base-200 h-screen'>
            <Head title="Quiz Start" />

            {question !== null ? (
                <div className='mx-auto py-4 px-2 md:px-4 max-w-7xl'>
                    <div className='text-6xl font-bold mx-auto w-full text-center mt-24'>
                        {question.text}
                    </div>
                    <div className='w-full flex flex-row mt-24'>
                        <div className='text-5xl font-bold'>{timer}</div>
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
                                <div 
                                    className='btn btn-primary'
                                    onClick={() => handleNext()}
                                >
                                    {action}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
            <div className='absolute bottom-0 shadow-lg w-full p-4 bg-base-100'>
                <div className='flex flex-row w-full justify-between font-bold'>
                    <div>{indexQuestion}/{len}</div>
                    <div className='flex flex-row gap-2 items-center'>
                        <div>Game Code : {session.code}</div>
                        <Link href={route("quizzes.destroy", session.quiz_id)} method="post" className='btn btn-outline btn-sm'>End</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
