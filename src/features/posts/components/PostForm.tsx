import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { postSchema, type NewPostInput } from '../postSchema'
import { useCreatePost } from '../useCreatePost'

interface PostFormProps {
  userId: number
}

export function PostForm({ userId }: PostFormProps) {
  const createPost = useCreatePost()
  const form = useForm<NewPostInput>({
    resolver: zodResolver(postSchema),
    defaultValues: { title: '', body: '' },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  })

  function onSubmit(values: NewPostInput) {
    createPost.mutate(
      { ...values, userId },
      {
        onSuccess: () => {
          form.reset()
          form.setFocus('title')
          toast.success('Post published')
        },
      },
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>New post</CardTitle>
      </CardHeader>
      <CardContent>
        <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="post-title">Title</FieldLabel>
                  <Input
                    {...field}
                    id="post-title"
                    placeholder="Give your post a title"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="body"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="post-body">Body</FieldLabel>
                  <Textarea
                    {...field}
                    id="post-body"
                    rows={4}
                    placeholder="What do you want to say?"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {createPost.isError && (
              <Alert variant="destructive">
                <AlertDescription>Couldn't publish the post. Please try again.</AlertDescription>
              </Alert>
            )}

            <Button type="submit" disabled={createPost.isPending} className="self-end">
              {createPost.isPending && <Loader2 className="animate-spin" />}
              {createPost.isPending ? 'Publishing…' : 'Publish'}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
