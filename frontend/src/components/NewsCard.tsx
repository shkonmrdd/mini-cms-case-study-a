import { format } from "date-fns";
import { useState } from "react";
import { NewsItem } from "../types/news";
import NewsPopup from "./NewsPopup";

interface NewsCardProps {
  news: NewsItem;
}

const NewsCard = ({ news }: NewsCardProps) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

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

  const placeholderImage = `https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80`;

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  return (
    <>
      <article 
        className="card" 
        style={{ backgroundColor: "#fff8e6", cursor: "pointer", borderRadius: "12px" }}
        onClick={openPopup}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <img
            src={news.image_url || placeholderImage}
            alt={news.title}
          />
          <p className={getCategoryClass(news.category)}>{news.category}</p>
        </div>

        <div className="card-content">
          <h3 className="title line-clamp-2">{news.title}</h3>

          <p className="date">{formatDate(news.created_at)}</p>

          <p className="excerpt line-clamp-3">
            {news.summary || news.content.substring(0, 150) + "..."}
          </p>
        </div>
      </article>

      <NewsPopup 
        news={news} 
        isOpen={isPopupOpen} 
        onClose={closePopup} 
      />
    </>
  );
};

export default NewsCard;
