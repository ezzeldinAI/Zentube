"use client";

import type { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { CopyCheckIcon, CopyIcon, EllipsisVerticalIcon, Globe2Icon, ImagePlusIcon, LockIcon, MoreVerticalIcon, RefreshCcwIcon, RotateCcwIcon, SparklesIcon, Trash2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { videoUpdateSchema } from "@/db/schema";
import { snakeCaseToTitle } from "@/lib/utils";
import { ThumbnailUploadModal } from "@/modules/studio/ui/components/thumbnail-upload-modal";
import { THUMBNAIL_FALLBACK } from "@/modules/videos/constants";
import { VideoPlayer } from "@/modules/videos/ui/components/video-player";
import { trpc } from "@/trpc/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "zentube/ui/accordion";
import { Button } from "zentube/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "zentube/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "zentube/ui/form";
import { Input } from "zentube/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "zentube/ui/select";
import { Separator } from "zentube/ui/separator";
import { Textarea } from "zentube/ui/textarea";

import { VideoDeleteConfirmationDialog } from "../components/video-delete-confirmation-dialog";

type FormSectionProps = {
  videoId: string;
};

export function FormSection({ videoId }: FormSectionProps) {
  return (
    <Suspense fallback={<p>Loading</p>}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <FormSectionSuspense videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  );
}

function FormSectionSuspense({ videoId }: FormSectionProps) {
  const [video] = trpc.studio.getOne.useSuspenseQuery({ id: videoId });
  const [categories] = trpc.categories.getMany.useSuspenseQuery();

  const utils = trpc.useUtils();
  const router = useRouter();

  const confirmBeforeDeleting = true;
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const [thumbnailModalOpen, setThumbnailModeOpen] = useState(false);

  const update = trpc.videos.update.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate();
      utils.studio.getOne.invalidate({
        id: videoId,
      });
      toast.success("Video updated");
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  const restoreThumbnail = trpc.videos.restoreThumbnail.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate();
      utils.studio.getOne.invalidate({
        id: videoId,
      });
      toast.success("Thumbnail Restored");
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  const remove = trpc.videos.remove.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate();
      utils.studio.getOne.invalidate({
        id: videoId,
      });
      toast.success("Video removed");
      router.push("/studio");
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  function onDelete() {
    if (confirmBeforeDeleting) {
      setIsConfirmDialogOpen(true);
    }
    else {
      setIsConfirmDialogOpen(false);
      remove.mutate({ id: videoId });
    }
  }

  // @ts-expect-error drizzle-orm zod schema type mismatch workaround
  const form = useForm<z.infer<typeof videoUpdateSchema>>({
    resolver: zodResolver(videoUpdateSchema),
    defaultValues: video,
  });

  // @ts-expect-error drizzle-orm zod schema type mismatch workaround
  async function onSubmit(data: z.infer<typeof videoUpdateSchema>) {
    await update.mutate(data);
  }

  // Add embedded (shortened / beautified) and most importantly trackable shareable link
  // eslint-disable-next-line node/no-process-env
  const fullUrl = `${process.env.VERCEL_URL || "http://localhost:3000"}/video/${video.id}`;
  const [isCopied, setIsCopied] = useState(false);

  async function onCopy() {
    await navigator.clipboard.writeText(fullUrl);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  }

  function onReload() {
    router.refresh();
    toast.success("Reloaded successfully");
  }

  return (
    <>
      <VideoDeleteConfirmationDialog isOpen={isConfirmDialogOpen} onCancel={() => setIsConfirmDialogOpen(false)} onConfirm={() => remove.mutate({ id: videoId })} />
      <ThumbnailUploadModal open={thumbnailModalOpen} onOpenChange={setThumbnailModeOpen} videoId={videoId} />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Video details</h1>
              <p className="text-xs text-muted-foreground">Manage your video details</p>
            </div>

            <div className="flex gap-2 items-center justify-center">
              <div className="flex items-center gap-x-2">
                <Button type="button" onClick={() => onReload()}>
                  <RefreshCcwIcon className="size-4" />
                  Reload
                </Button>
                <Button variant="secondary" type="submit" disabled={update.isPending} isLoading={update.isPending}>
                  Update
                </Button>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <EllipsisVerticalIcon />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onDelete} variant="destructive">
                    <Trash2Icon className="size-4" />
                    <p>Delete</p>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 divide-x-2 divide-dashed divide-zinc-500/10 ">
            <div className="space-y-8 lg:col-span-3 space-x-4">
              <FormField
                disabled={update.isPending}
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Title
                      {/* TODO: Add AI generate button */}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="ZenTube is the best platform"
                        className="shadow-md shadow-zinc-500/15"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                disabled={update.isPending}
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Description
                      {/* TODO: Add AI generate button */}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        value={field.value ?? ""}
                        rows={10}
                        className="resize-none pr-10 shadow-md shadow-zinc-500/15"
                        placeholder="ZenTube is the best platform because not owned by Google"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="thumbnailUrl"
                control={form.control}
                render={() => (
                  <FormItem>
                    <FormLabel>Thumbnail</FormLabel>
                    <FormControl>
                      <div className="p-0.5 border border-dashed border-neutral-400 relative h-[84px] w-[153px] group rounded-lg overflow-hidden">
                        <Image
                          src={video.thumbnailUrl ?? THUMBNAIL_FALLBACK}
                          alt="Thumbnail"
                          fill
                          className="object-cover"
                        />

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button type="button" size="icon" className="bg-black/50 hover:bg-black/15 absolute top-1 right-1 opacity-100 md:opacity-0 group-hover:opacity-100 duration-300 size-7">
                              <MoreVerticalIcon className="text-white" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" side="right">
                            <DropdownMenuItem onClick={() => setThumbnailModeOpen(true)}>
                              <ImagePlusIcon className="size-4 mr-1 text-bold" />
                              Change
                            </DropdownMenuItem>

                            <DropdownMenuItem>
                              <SparklesIcon className="size-4 mr-1 text-bold" />
                              AI-Generate
                            </DropdownMenuItem>

                            <DropdownMenuItem onClick={() => restoreThumbnail.mutate({ id: videoId })}>
                              <RotateCcwIcon className="size-4 mr-1 text-bold" />
                              Restore
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="w-full pr-4">
                <FormField
                  disabled={update.isPending}
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Category
                      </FormLabel>
                      <Select
                        disabled={update.isPending}
                        autoComplete={categories.toString()}
                        onValueChange={field.onChange}
                        defaultValue={field.value ?? undefined}
                      >
                        <FormControl className="shadow-md shadow-zinc-500/15 w-full">
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category.id} value={category.id} className="w-full">
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex flex-col gap-y-8 lg:col-span-2">
              <div className="flex flex-col gap-4 bg-[#f9f9f9] rounded-lg overflow-hidden h-full">
                <div className="aspect-video overflow-hidden relative">
                  <VideoPlayer
                    playbackId={video.muxPlaybackId}
                    thumbnailUrl={video.thumbnailUrl}
                  />
                </div>

                <div className="p-4 flex flex-col gap-y-2">
                  <div className="flex justify-between items-center gap-x-2">
                    <div className="flex flex-col gap-y-1">
                      <p className="text-muted-foreground text-xs">Video Link</p>

                      <div className="flex items-center gap-x-2">
                        <Button size="icon" variant="outline" type="button" onClick={onCopy} disabled={isCopied}>
                          {isCopied ? <CopyCheckIcon /> : <CopyIcon />}
                        </Button>

                        <Link
                          href={`/videos/${videoId}`}
                        >
                          <p className="line-clamp-1 text-sm text-blue-500 max-w-[300px] truncate">
                            {`https://localhost:3000/video/${videoId}`}
                          </p>
                        </Link>

                      </div>
                    </div>
                  </div>

                  <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                      <AccordionTrigger>More Information</AccordionTrigger>
                      <AccordionContent>
                        <div>
                          <div className="flex justify-between items-center">
                            <div className="flex flex-col gap-2">
                              <p className="text-muted-foreground text-xs">
                                Video Status
                              </p>
                              <p className="text-sm">
                                {snakeCaseToTitle(video.muxStatus || "preparing")}
                              </p>
                            </div>
                          </div>

                          <Separator className="my-4" />

                          <div className="flex justify-between items-center">
                            <div className="flex flex-col gap-2">
                              <p className="text-muted-foreground text-xs">
                                Subtitles Status
                              </p>
                              <p className="text-sm">
                                {snakeCaseToTitle(video.muxTrackStatus || "no_subtitle")}
                              </p>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>

              <FormField
                disabled={update.isPending}
                control={form.control}
                name="visibility"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Visibility
                    </FormLabel>
                    <Select
                      disabled={update.isPending}
                      autoComplete={categories.toString()}
                      onValueChange={field.onChange}
                      defaultValue={field.value ?? undefined}
                    >
                      <FormControl className="shadow-md shadow-zinc-500/15 w-full">
                        <SelectTrigger>
                          <SelectValue placeholder="Select a visibility" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="public" className="w-full">
                          <Globe2Icon className="size-4" />
                          Public
                        </SelectItem>

                        <SelectItem value="private" className="w-full">
                          <LockIcon className="size-4" />
                          Private
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>
          </div>
        </form>
      </Form>
    </>
  );
}
