import { format } from "date-fns";
import { NewsItem } from "../types/news";

interface NewsPopupProps {
  news: NewsItem;
  isOpen: boolean;
  onClose: () => void;
}

const NewsPopup = ({ news, isOpen, onClose }: NewsPopupProps) => {
  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMMM d, yyyy");
    } catch {
      return dateString;
    }
  };

  const getCategoryClass = (category: string) => {
    const categoryLower = category.toLowerCase();
    switch (categoryLower) {
      case "community":
        return "category-community";
      case "business":
        return "category-business";
      case "science":
        return "category-science";
      case "sports":
        return "category-sports";
      default:
        return "category";
    }
  };

  return (
    <div 
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div 
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: window.innerWidth <= 640 ? "20px" : "30px",
          maxWidth: window.innerWidth <= 640 ? "100%" : "800px",
          width: "100%",
          maxHeight: "80vh",
          overflow: "auto",
          position: "relative",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "15px",
            right: "15px",
            background: "none",
            border: "none",
            fontSize: "24px",
            cursor: "pointer",
            color: "#666",
            width: "30px",
            height: "30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ×
        </button>

        {/* News content */}
        <div style={{ marginBottom: "20px" }}>
          <p className={getCategoryClass(news.category)} style={{ marginBottom: "10px" }}>
            {news.category}
          </p>
          <h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "15px", lineHeight: "1.3" }}>
            {news.title}
          </h1>
          <p style={{ color: "#666", marginBottom: "20px" }}>
            {formatDate(news.created_at)}
          </p>
        </div>

        {news.image_url && (
          <img
            src={news.image_url}
            alt={news.title}
            style={{
              width: "100%",
              maxHeight: "300px",
              objectFit: "cover",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          />
        )}

        <div style={{ lineHeight: "1.6", fontSize: "16px", color: "#333" }}>
          {news.content.split('\n').map((paragraph, index) => (
            <p key={index} style={{ marginBottom: "15px" }}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsPopup; 