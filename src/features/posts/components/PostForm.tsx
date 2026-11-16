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
  // Number the new post will take; null while the user's posts are still loading.
  nextNumber: number | null
}

// Controls sit on the red composer tile: white fields, and white rings and messages for errors,
// because the theme's destructive red would vanish against the tile.
const controlClass =
  'border-transparent bg-white text-tile-ink placeholder:text-tile-ink-soft/80 focus-visible:border-transparent focus-visible:ring-white/60 aria-invalid:border-transparent aria-invalid:ring-3 aria-invalid:ring-white'

export function PostForm({ userId, nextNumber }: PostFormProps) {
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
    <Card className="gap-4 rounded-3xl border-0 bg-primary text-primary-foreground shadow-none ring-0">
      <CardHeader className="flex flex-row items-start justify-between gap-4 px-5 md:px-6">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-xl font-semibold">New post</CardTitle>
          <p className="text-sm text-primary-foreground">
            It appears first in the list once published.
          </p>
        </div>
        {nextNumber !== null && (
          <span
            aria-hidden="true"
            key={nextNumber}
            className="-mb-3 text-7xl leading-[0.8] font-light motion-safe:animate-in motion-safe:duration-300 motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-3 md:text-[5.5rem]"
          >
            {String(nextNumber).padStart(2, '0')}
          </span>
        )}
      </CardHeader>
      <CardContent className="px-5 md:px-6">
        <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="gap-4">
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-1.5">
                  <FieldLabel htmlFor="post-title" className="text-primary-foreground">
                    Title
                  </FieldLabel>
                  <Input
                    {...field}
                    id="post-title"
                    placeholder="Give your post a title"
                    aria-invalid={fieldState.invalid}
                    className={`h-10 rounded-xl ${controlClass}`}
                  />
                  {fieldState.invalid && (
                    <FieldError
                      errors={[fieldState.error]}
                      className="font-medium text-primary-foreground"
                    />
                  )}
                </Field>
              )}
            />
            <Controller
              name="body"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-1.5">
                  <FieldLabel htmlFor="post-body" className="text-primary-foreground">
                    Body
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id="post-body"
                    rows={4}
                    placeholder="What do you want to say?"
                    aria-invalid={fieldState.invalid}
                    className={`rounded-xl ${controlClass}`}
                  />
                  {fieldState.invalid && (
                    <FieldError
                      errors={[fieldState.error]}
                      className="font-medium text-primary-foreground"
                    />
                  )}
                </Field>
              )}
            />

            {createPost.isError && (
              <Alert className="border-white/50 bg-white/15 text-primary-foreground">
                <AlertDescription className="text-primary-foreground">
                  Couldn't publish the post. Please try again.
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              disabled={createPost.isPending}
              className="h-10 self-start rounded-full bg-white px-5 text-primary hover:bg-white/90 focus-visible:ring-white/60"
            >
              {createPost.isPending && <Loader2 className="animate-spin" />}
              {createPost.isPending ? 'Publishing…' : 'Publish'}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
