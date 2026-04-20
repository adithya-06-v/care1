import { useParams } from 'react-router-dom';
import { VideoCall } from '@/components/video/VideoCall';

const VideoCallPage = () => {
  const { roomId } = useParams<{ roomId: string }>();

  if (!roomId) {
    return null;
  }

  return <VideoCall roomId={roomId} />;
};

export default VideoCallPage;
