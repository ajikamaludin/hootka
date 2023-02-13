import React from 'react'
import { Head, Link } from '@inertiajs/react'

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import Pagination from '@/Components/Pagination'

export default function Index(props) {
    const { data: sessions, links } = props.sessions

    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            flash={props.flash}
        >
            <Head title="Participants" />
            <div className="flex flex-col w-full sm:px-6 lg:px-8 space-y-2">
                <div className="card bg-base-100 w-full">
                    <div className="card-body pb-40">
                        <div className="flex w-full mb-4 justify-between text-xl font-bold">
                            {/*  */}
                            <div>Quiz: {props.quiz.name}</div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="table w-full table-zebra">
                                <thead>
                                    <tr>
                                        <th>Id</th>
                                        <th>Code</th>
                                        <th>Start</th>
                                        <th>End</th>
                                        <th>Question</th>
                                        <th>Participants</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sessions?.map((session) => (
                                        <tr key={session.id}>
                                            <th>{session.id}</th>
                                            <td>{session.code}</td>
                                            <td>{session.start_time}</td>
                                            <td>{session.end_time}</td>
                                            <td>{session.total_question}</td>
                                            <td>{session.participants_count}</td>
                                            <td className="text-right items-center flex justify-end">
                                                <Link
                                                    className="btn btn-secondary mx-1"
                                                    href={route("quizzes.participants", {quiz: session.quiz_id, session: session.id})}
                                                >
                                                    Participants
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className='flex w-full justify-center'>
                            <Pagination links={links} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}