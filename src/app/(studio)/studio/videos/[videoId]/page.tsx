import { VideoView } from "@/modules/studio/ui/views/video-view";
import { HydrateClient, trpc } from "@/trpc/server";

type VideoPageProps = {
  params: Promise<{ videoId: string }>;
};

export const dynamic = "force-dynamic";

export default async function VideoPage({ params }: VideoPageProps) {
  const { videoId } = await params;

  void trpc.studio.getOne.prefetch({ id: videoId });
  void trpc.categories.getMany.prefetch();

  return (
    <HydrateClient>
      <VideoView videoId={videoId} />
    </HydrateClient>
  );
}
