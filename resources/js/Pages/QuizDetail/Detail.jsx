import React from 'react'
import { Head } from '@inertiajs/react'

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import Pagination from '@/Components/Pagination'

export default function Index(props) {
    const { data: participants, links } = props.participants
    const { quiz, session } = props

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
                        <div className="flex flex-col w-full mb-4 justify-between text-xl font-bold">
                            {/*  */}
                            <div>Quiz: {quiz.name}</div>
                            <div>Time: {session.start_time} - {session.end_time}</div>
                            <div>Session Code: {session.code}</div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="table w-full table-zebra">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Score</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {participants?.map((participant, index) => (
                                        <tr key={participant.id}>
                                        <td>{index + 1}</td>
                                        <td>{participant.name}</td>
                                        <td>{participant.score}</td>
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