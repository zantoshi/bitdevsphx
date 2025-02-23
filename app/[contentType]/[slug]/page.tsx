import getJsonFile, { ParsedData } from '@/lib/get-json'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import { FC } from 'react'
import Image from 'next/image'
import { Mdx } from '@/components/MDX-components'
import { allDocs } from 'contentlayer/generated'

const contentType = 'events'

interface PageProps {
  params: {
    slug: string
    contentType: string
  }
}

type Args = {
  slug: string
  contentType: string
}

async function getDocFromParams(params: Args) {
  let data: ParsedData | undefined
  const post = allDocs.find((post) => post.slugAsParams === params.slug)

  if (params.contentType === contentType) {
    data = await getJsonFile({ fileName: params.slug })
  }

  return { post, data }
}

const page = async ({ params }: PageProps) => {
  const { post, data } = await getDocFromParams(params)

  if (params.contentType === contentType && data === undefined)
    console.log(`No summary generated for ${params.slug}`)

  if (!post) {
    return <div>404 sorry you poor bitdev</div>
  }

  return (
    <main className="w-full dark:text-white">
      <article className="flex flex-col lg:flex-row w-full">
        {/* Nav */}
        <div className="lg:w-1/3 min-w-[300px] max-w-full lg:max-w-[480px] h-full lg:h-screen p-8 drop-shadow-sidebar lg:sticky top-[82px] left-0 z-[49] bg-white dark:bg-black overflow-y-auto flex flex-col gap-4 lg:block">
          <header className="font-sans flex flex-col gap-2">
            <h1 className="text-4xl font-black">{post.title}</h1>
            <time className="text-2xl text-gray-500">{post.date}</time>
            {params.contentType === 'posts' ? (
              <p className="text-xl flex flex-row gap-2 items-center">
                {post.author}
              </p>
            ) : (
              ``
            )}
            {params.contentType === 'events' ? (
              <p className="text-xl flex flex-row gap-2 items-center">
                {post.meetupLink ? (
                  <>
                    <a href={post.meetupLink}>Meetup Link</a>
                    <ArrowTopRightOnSquareIcon className="w-6 h-6" />
                  </>
                ) : (
                  ``
                )}
              </p>
            ) : (
              ``
            )}
          </header>
          {params.contentType === 'events' ? (
            <nav>
              {/* <ul className="list-disc font-sans">
                <li>Content Outline</li>
              </ul> */}
            </nav>
          ) : (
            ``
          )}
        </div>

        {/* Content */}
        <div className="lg:ml-10 relative z-1 w-full">
          <div className="container mx-auto max-w-5xl px-4 pb-4">
            {post.image ? (
              <Image
                src={'/' + post.image}
                width="960"
                height="540"
                className="w-full h-auto mb-8"
                alt=""
              />
            ) : (
              <div className="w-full h-8"></div>
            )}

            <Mdx
              code={post.body.code}
              slug={params.slug}
              jsonData={data}
              page={false}
            />
          </div>
        </div>
      </article>
    </main>
  )
}

export default page
