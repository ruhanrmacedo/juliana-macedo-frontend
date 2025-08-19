
import { Eye, Heart, MessageSquare } from "lucide-react";

interface PostCardProps {
  id: number;
  image: string;
  title: string;
  excerpt: string;
  likes: number;
  comments: number;
  views: number; // opcional, caso queira exibir visualizações
  onReadMore?: () => void;
}

const PostCard = ({ image, title, excerpt, likes, comments, views, onReadMore }: PostCardProps) => {
  return (
    <div className="card overflow-hidden group">
      <div className="relative overflow-hidden aspect-video">
        <img
          src={image}
          alt={title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-6 space-y-4">
        <h3 className="font-heading font-bold text-xl line-clamp-2">{title}</h3>
        <p className="text-gray-600 line-clamp-3">{excerpt}</p>
        <div className="flex justify-between items-center">
          <div className="flex space-x-4 text-gray-500">
            <span className="flex items-center space-x-1">
              <Eye size={18} />
              <span>{views}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Heart size={18} />
              <span>{likes}</span>
            </span>
            <span className="flex items-center space-x-1">
              <MessageSquare size={18} />
              <span>{comments}</span>
            </span>
          </div>
          <button className="btn-primary" onClick={onReadMore}>
            Ler mais
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;

