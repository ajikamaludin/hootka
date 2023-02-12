import React from 'react';
import "@fullcalendar/react/dist/vdom";

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head,Link } from '@inertiajs/react';

export default function Dashboard(props) {
    const { count_active, count_update } = props

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
                        <div>0</div> 
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
