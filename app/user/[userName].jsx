// pages/users/[userName].js
import prisma from '../../lib/prisma'
import { useRouter } from 'next/router'

export async function getServerSideProps({ params }) {
  const { userName } = params
  const files = await prisma.file.findMany({
    where: { userName },
    orderBy: { createdAt: 'desc' },
  })

  return {
    props: { files, userName },
  }
}

export default function UserFiles({ files, userName }) {
  return (
    <div>
      <h1>{userName}'s Files</h1>
      {files.length === 0 ? (
        <p>No files found.</p>
      ) : (
        <ul>
          {files.map((file) => (
            <li key={file.id}>
              <a href={file.fileUrl} target="_blank" rel="noopener noreferrer">
                {file.filename}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
