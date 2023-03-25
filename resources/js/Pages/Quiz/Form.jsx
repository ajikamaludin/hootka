import React, { useEffect, useRef } from 'react'
import { Link, Head, useForm } from '@inertiajs/react'
import { toast } from 'react-toastify'

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import PrimaryButton from '@/Components/PrimaryButton'
import InputLabel from '@/Components/InputLabel'
import TextInput from '@/Components/TextInput'
import InputError from '@/Components/InputError'
import { CheckIcon, OptionIcon, PencilIcon, TrashIcon } from '@/Components/Icons'
import { useModalState } from '@/Hooks'
import QuestionModal from './QuestionModal'

export default function FormQuiz(props) {
    const { quiz }= props

    const questionModal = useModalState()
    const { data, setData, post, put, processing, errors } = useForm({
        name: '',
        answer_key_url: '',
        questions: [],
    });

    const toggleQuestionForm = (question = null, index = null) => {
        questionModal.setData({question, index})
        questionModal.toggle()
    }

    const onQuestionSave = (q, index) => {
        if (index === null) {
            setData("questions", data.questions.concat(q))
            return
        }
        setData("questions", data.questions.map((que, i) => {
            if (i === index) {
                return q
            }
            return que
        }))
    }

    const removeQuestion = (index) => {
        setData('questions', data.questions.filter((_, i) => i !== index))
    }

    const toggleAnswer = (index) => {
        setData('questions', data.questions.map((q, i) => {
            if (i === index) {
                return {
                    ...q,
                    show_answers: !q.show_answers
                }
            }
            return q
        } ))
    }

    useEffect(() => {
        if(quiz !== undefined) {
            setData({
                name: quiz?.name,
                questions: quiz?.questions,
                answer_key_url: quiz?.answer_key_url
            })
        }
    }, [quiz]);

    const onHandleChange = (event) => {
        setData(event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value);
    };

    const submit = (e) => {
        e.preventDefault();

        if(quiz !== undefined) {
            put(route('quizzes.update', quiz), {
                onError: () => toast.error('please recheck the data')
            });
            return
        }
        post(route('quizzes.store'), {
            onError: () => toast.error('please recheck the data')
        });
    };

    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            flash={props.flash}
        >
            <Head title="Quiz - Form" />

            <div className="flex flex-col w-full px-6 lg:px-8 space-y-2 overflow-hidden">
                <div className="card bg-base-100 w-full">
                    <div className="card-body">
                        <p className='font-bold text-2xl mb-4'>Quiz</p>
                        <div className="overflow-x-auto">
                        <form onSubmit={submit}>
                            <div className='mt-4'>
                                <InputLabel forInput="name" value="Nama" />
                                <TextInput
                                    type="text"
                                    name="name"
                                    value={data.name}
                                    className="mt-1 block w-full"
                                    autoComplete={"false"}
                                    handleChange={onHandleChange}
                                    isError={errors.name}
                                />
                                <InputError message={errors.name}/>
                            </div>
                            {data.questions.map((q, i) => (
                                <div className='mt-4 ml-8' key={`ques#${i}`}>
                                    <InputLabel forInput="name" value={`Question #${i + 1}`} />
                                    <div className='flex flex-row items-center gap-1'>
                                        <div className='w-full'>
                                            <input
                                                type="text"
                                                className="mt-1 block w-full input input-bordered"
                                                readOnly={true}
                                                value={q.text}
                                            />
                                        </div>
                                        <input
                                            type="text"
                                            className="mt-1 block w-1/12 input input-bordered"
                                            readOnly={true}
                                            value={`${q.time}s`}
                                        />
                                        <div className='btn btn-outline' onClick={() => toggleAnswer(i)}>
                                            <OptionIcon/>
                                        </div>
                                        <div className='btn btn-outline' onClick={() => toggleQuestionForm(q, i)}>
                                            <PencilIcon/>
                                        </div>
                                        <div className='btn btn-error btn-outline' onClick={() => removeQuestion(i)}>
                                            <TrashIcon/>
                                        </div>
                                    </div>
                                    <div className={q.show_answers ? `block` : 'hidden'}>
                                        {q.answers.map((ans, i) => (
                                            <div className='mt-4 ml-16' key={`${q.text}-${i}`}>
                                                <InputLabel forInput="name" value={`Answer #${i + 1}`} />
                                                <div className='w-full flex flex-row items-center gap-1'>
                                                    <div className='flex-1'>
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        className='input input-bordered w-full'
                                                        value={ans.text}
                                                        readOnly={true}
                                                    />
                                                    </div>
                                                    {+ans.is_correct === 1 && (
                                                    <div className='btn btn-outline btn-info'>
                                                        <CheckIcon/>
                                                    </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            <div className='mt-4'>
                                <div 
                                    className='btn btn-outline btn-primary'
                                    onClick={() => toggleQuestionForm()}
                                >
                                    Add Question
                                </div>
                            </div>
                            
                            <div className='mt-4'>
                                <InputLabel forInput="name" value="URL Pembahasan" />
                                <TextInput
                                    type="text"
                                    name="answer_key_url"
                                    value={data.answer_key_url}
                                    className="mt-1 block w-full"
                                    autoComplete={"false"}
                                    handleChange={onHandleChange}
                                    isError={errors.answer_key_url}
                                />
                                <InputError message={errors.name}/>
                            </div>
                            <div className="flex items-center justify-between mt-4">
                                <PrimaryButton processing={processing}>
                                    Save
                                </PrimaryButton>

                                <Link href={route('quizzes.index')} className="btn btn-outline">
                                    Back
                                </Link>
                            </div>
                        </form>
                        </div>
                    </div>
                </div>
            </div>
            <QuestionModal 
                modalState={questionModal}
                onQuestionSave={onQuestionSave}
            />
        </AuthenticatedLayout>
    )
}