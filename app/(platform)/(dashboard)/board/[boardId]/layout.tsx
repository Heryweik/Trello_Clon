import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { notFound, redirect } from 'next/navigation'
import BoardNavbar from './_components/board-navbar'

// Ponemos nombre al texto que esta a la par del favicon
export async function generateMetadata({params}: {params: {boardId: string}}) {
    const {orgId} = auth()

    if (!orgId) {
        return {
            title: 'Board'
        }
    }

    const board = await db.board.findUnique({
        where: {
            id: params.boardId,
            orgId
        }
    })

    return {
        title: board?.title || 'Board'
    }
}

// boardId es el nombre en el archivo de la carpeta
export default async function BoardIdLayout({ children, params }: { children: React.ReactNode, params: {boardId: string}}) {

    const {orgId} = auth()

    if (!orgId) {
        redirect('/select-org')
    }

    const board = await db.board.findUnique({
        where: {
            id: params.boardId,
            orgId
        }
    })

    if (!board) {
        notFound()
    }

  return (
    <div style={{backgroundImage: `url(${board.imageFullUrl})`}}
        className='relative h-full bg-no-repeat bg-cover bg-center'
    >
        <BoardNavbar data={board}/>
        <div className='absolute inset-0 bg-black/10' />

        <main className='relative pt-28 h-full'>
        {children}
        </main>
    </div>
  )
}
