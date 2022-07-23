import { Layout, Text, Page, Code, Input, Button } from '@vercel/examples-ui'
import useSWR from 'swr'
import cn from 'clsx'
import type { Todo } from '../lib/db'
import Head from 'next/head'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

function Home() {
  const { data, error, mutate } = useSWR('/api/todo', fetcher)
  const todos = data?.todos

  return (
    <Page>
      <Head>
        <link
          rel="preload"
          href="/api/todo"
          as="fetch"
          crossOrigin="anonymous"
        />
      </Head>

      <Text variant="h1" className="mb-6">
        Testing Example
      </Text>
      <Text className="mb-4">You can now start adding Todos:</Text>
      <form
        className="flex"
        onSubmit={async (e) => {
          e.preventDefault()

          const form = e.currentTarget
          const data = Object.fromEntries(new FormData(form))
          const res = await fetch('/api/todo', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title: data.title }),
          })
          const { todos } = await res.json()

          form.reset()
          await mutate({ todos })
        }}
      >
        <Input name="title" placeholder="What needs to be done?" />
        <Button
          type="submit"
          className="ml-4"
          width="120px"
          loading={false}
          onClick={() => {}}
        >
          Add Todo
        </Button>
      </form>
      <div>
        {todos ? (
          todos.length ? (
            <ul className="border-accents-2 border rounded-md bg-white divide-y divide-accents-2 my-6">
              {todos.map((todo: Todo) => (
                <li
                  key={todo.id}
                  className="flex items-center justify-content py-6 px-6"
                >
                  <span className="flex-1">
                    <p
                      className={cn('font-medium', todo.done && 'line-through')}
                    >
                      {todo.title}
                    </p>
                  </span>
                  <span className="w-48 flex justify-end">
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      className="mr-2"
                      onClick={async () => {
                        const res = await fetch(`/api/todo?id=${todo.id}`, {
                          method: 'PATCH',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({ done: !todo.done }),
                        })
                        const { todos } = await res.json()

                        await mutate({ todos })
                      }}
                    >
                      {todo.done ? 'Undo' : 'Complete'}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={async () => {
                        const res = await fetch(`/api/todo?id=${todo.id}`, {
                          method: 'DELETE',
                        })
                        const { todos } = await res.json()

                        await mutate({ todos })
                      }}
                    >
                      Remove
                    </Button>
                  </span>
                </li>
              ))}
            </ul>
          ) : null
        ) : error ? (
          <p className="my-6">Failed to load todos</p>
        ) : null}
      </div>
    </Page>
  )
}

Home.Layout = Layout

export default Home
