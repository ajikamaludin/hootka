import React, { useState, useEffect } from 'react'
import { router, Head, Link } from '@inertiajs/react'
import { usePrevious } from 'react-use'
import { toast } from 'react-toastify'

import { useModalState } from '@/Hooks'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import Pagination from '@/Components/Pagination'
import ModalConfirm from '@/Components/ModalConfirm'

export default function Index(props) {
    const { data: quizzes, links } = props.quizzes

    const [search, setSearch] = useState('')
    const preValue = usePrevious(search)

    const confirmModal = useModalState(false)
    const handleDelete = (quiz) => {
        confirmModal.setData(quiz)
        confirmModal.toggle()
    }

    const onDelete = () => {
        const quiz = confirmModal.data
        if(quiz != null) {
            router.delete(route('quizzes.destroy', quiz), {
                onSuccess: () => toast.success('The Data has been deleted'),
            })
        }
    }

    const canCreate = true //hasPermission('create-user', props.auth.user)
    const canUpdate = true //hasPermission('update-user', props.auth.user)
    const canDelete = true //hasPermission('delete-user', props.auth.user)

    useEffect(() => {
        if (preValue) {
            router.get(
                route(route().current()),
                { q: search },
                {
                    replace: true,
                    preserveState: true,
                }
            )
        }
    }, [search])

    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            flash={props.flash}
        >
            <Head title="Quiz" />
            <div className="flex flex-col w-full sm:px-6 lg:px-8 space-y-2">
                <div className="card bg-base-100 w-full">
                    <div className="card-body">
                        <div className="flex w-full mb-4 justify-between">
                            {canCreate && (
                                <Link
                                    href={route('quizzes.create')}
                                    className="btn btn-neutral"
                                >
                                    Tambah
                                </Link>
                            )}
                            <div className="form-control">
                                <input
                                    type="text"
                                    className="input input-bordered"
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(e.target.value)
                                    }
                                    placeholder="Search"
                                />
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="table w-full table-zebra">
                                <thead>
                                    <tr>
                                        <th>Id</th>
                                        <th>Nama</th>
                                        <th>User</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {quizzes?.map((quiz) => (
                                        <tr key={quiz.id}>
                                            <th>{quiz.id}</th>
                                            <td>{quiz.name}</td>
                                            <td>{quiz.creator?.name}</td>
                                            <td className="text-right">
                                                {canUpdate && (
                                                    <Link
                                                        href={route("quizzes.edit", quiz)}
                                                        className="btn btn-primary mx-1"
                                                    >
                                                        Edit
                                                    </Link>
                                                )}
                                                {canDelete && (
                                                    <div
                                                        className="btn btn-secondary mx-1"
                                                        onClick={() =>
                                                            handleDelete(quiz)
                                                        }
                                                    >
                                                        Delete
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <Pagination links={links} />
                    </div>
                </div>
            </div>
            <ModalConfirm
                isOpen={confirmModal.isOpen}
                toggle={confirmModal.toggle}
                onConfirm={onDelete}
            />
        </AuthenticatedLayout>
    )
}