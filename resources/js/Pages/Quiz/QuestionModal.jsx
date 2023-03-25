import React, { useState, useEffect } from 'react'
import { useForm, usePage } from '@inertiajs/react'
import { toast } from 'react-toastify'
import { CheckIcon, TrashIcon } from '@/Components/Icons'
import { answer } from '@/constants'


export default function QuestionModal(props) {
    const { modalState, onQuestionSave } = props

    const [index, setIndex] = useState(null)
    const [question, setQuestion] = useState('')
    const [time, setTime] = useState(30)
    const [answers, setAnswers] = useState([answer, answer, answer, answer])

    const addAnswer = () => {
        if(answers.length >= 4) {
            toast.error("maximum answers is 4")
            return
        }
        setAnswers(answers.concat(answer))
    }

    const changeAnswer = (e, index) => {
        if (e.target.type === 'checkbox') {
            setAnswers(answers.map((ans, i) => {
                if (i === index) {
                    return {
                        ...ans,
                        is_correct: e.target.checked ? 1 : 0
                    }
                }
                return ans
            }))
            return 
        }
        setAnswers(answers.map((ans, i) => {
            if (i === index) {
                return {
                    ...ans,
                    text: e.target.value
                }
            }
            return ans
        }))
    }

    const removeAnswer = (index) => {
        setAnswers(answers.filter((_, i) => i !== index))
    }

    const handleReset = () => {
        setQuestion('')
        setAnswers([answer, answer])
        modalState.setData(null)
    }

    const isAnswerEmpty = () => {
        const ans = []
        answers.map(a => {
            if (a.text === '') {
                ans.push(false)
                return
            }
            ans.push(true)
            return
        })
        if(ans.includes(false)){
            return false
        }
        return true
    }

    const handleSubmit = () => {
        if (question === '') {
            toast.error('question is empty')
            return
        }
        if(!isAnswerEmpty()) {
            toast.error('answers is empty')
            return
        }

        onQuestionSave({
            text: question,
            time: time,
            show_answers: true,
            answers: answers
        }, index)

        handleReset()
        modalState.toggle()
    }

    const handleCancel = () => {
        handleReset()
        modalState.toggle()
    }

    useEffect(() => {
        const q = modalState.data
        if (q !== null && q.question !== null) {
            setQuestion(q.question.text)
            setTime(q.question.time)
            setAnswers(q.question.answers)
            setIndex(q.index)
            return
        }
        setIndex(null)
    }, [modalState])

    return (
        <div
            className="modal modal-bottom sm:modal-middle pb-10"
            style={
                modalState.isOpen
                    ? {
                        opacity: 1,
                        pointerEvents: 'auto',
                        visibility: 'visible',
                        overflowY: 'initial',
                    }
                    : {}
            }
        >
            <div className="modal-box overflow-y-auto max-h-screen w-11/12 max-w-7xl">
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Question</span>
                    </label>
                    <textarea
                        placeholder="question"
                        className="textarea textarea-bordered"
                        name="name"
                        value={question}
                        onChange={e => setQuestion(e.target.value)}
                        rows={3}
                    />
                </div>
                <div className='mt-6 flex flex-row justify-between items-center'>
                    <label className="label">
                        <span className="label-text">Answer</span>
                    </label>
                    <div className='btn btn-outline btn-xs' onClick={addAnswer}>add</div>
                </div>
                <div className="w-full border-2 border-gray-300 p-1 rounded-lg">
                    <div className="form-control">
                        {answers.map((ans, i) => (
                            <div className='flex flex-row items-center gap-2 mt-1' key={`answer+${i}`}>
                                <input 
                                    type="checkbox" 
                                    className="checkbox" 
                                    checked={+ans.is_correct === 1}
                                    onChange={e => changeAnswer(e, i)}
                                />
                                <input
                                    type="text"
                                    placeholder={`answer #${i + 1}`}
                                    className="input input-bordered flex-1"
                                    name="name"
                                    value={ans.text}
                                    onChange={e => changeAnswer(e, i)}
                                />
                                {answers.length > 2 && (
                                    <div className='btn btn-outline btn-xs' onClick={() => removeAnswer(i)}>
                                        <TrashIcon className='w-4 h-4'/>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                <label className="label">
                    <span className="label-text-alt">Checked is correct answer</span>
                </label>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Time (s)</span>
                    </label>
                    <input
                        type="number"
                        placeholder="time (s)"
                        className="input input-bordered"
                        name="time"
                        value={time}
                        onChange={e => setTime(e.target.value)}
                    />
                </div>
                <div className="modal-action">
                    <div
                        onClick={handleSubmit}
                        className="btn btn-primary"
                    >
                        Save
                    </div>
                    <div
                        onClick={handleCancel}
                        className="btn btn-secondary"
                    >
                        Cancel
                    </div>
                </div>
            </div>
        </div>
    )
}