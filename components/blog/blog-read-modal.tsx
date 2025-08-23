import { BlogPostWithDetails } from "@/types/home/blog";

interface BlogReadModalProps {
  selectedPost: BlogPostWithDetails | null;
  closePost: () => void;
}

const BlogReadModal = ({ selectedPost, closePost }: BlogReadModalProps) => {
  return (
    <div>
      <h2>{selectedPost?.title}</h2>
      <button onClick={closePost}>Close</button>
    </div>
  );
};

export default BlogReadModal;
