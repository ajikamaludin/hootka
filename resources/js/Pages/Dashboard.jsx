import React from 'react';

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head,Link } from '@inertiajs/react';

export default function Dashboard(props) {
    const { count_user, count_quiz, count_session, count_participant } = props

    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            flash={props.flash}
        >
            <Head title="Dashboard" />

            <div className='mx-auto px-2 md:px-4 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1'>
                <div className="stats bg-base-100 shadow-md w-full overflow-hidden">
                    <div className="stat">
                        <div className="stat-title font-bold">Count Of User</div> 
                        <div className='stat-value'>{count_user}</div> 
                    </div>
                </div>
                <div className="stats bg-base-100 shadow-md w-full overflow-hidden">
                    <div className="stat">
                        <div className="stat-title font-bold">Count Of Quiz</div> 
                        <div className='stat-value'>{count_quiz}</div> 
                    </div>
                </div>
                <div className="stats bg-base-100 shadow-md w-full overflow-hidden">
                    <div className="stat">
                        <div className="stat-title font-bold">Count Of Session</div> 
                        <div className='stat-value'>{count_session}</div> 
                    </div>
                </div>
                <div className="stats bg-base-100 shadow-md w-full overflow-hidden">
                    <div className="stat">
                        <div className="stat-title font-bold">Count Of Participant</div> 
                        <div className='stat-value'>{count_participant}</div> 
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
