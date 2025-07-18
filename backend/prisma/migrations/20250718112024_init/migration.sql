-- CreateTable
CREATE TABLE "news" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "summary" TEXT,
    "image_url" VARCHAR(500),
    "category" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "news_pkey" PRIMARY KEY ("id")
);
