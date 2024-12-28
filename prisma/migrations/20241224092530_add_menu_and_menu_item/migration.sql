-- CreateTable
CREATE TABLE "Food" (
    "food_id" SERIAL NOT NULL,
    "food_name" TEXT NOT NULL,
    "food_description" TEXT,
    "food_price" DECIMAL(65,30) NOT NULL,
    "food_ingredients" TEXT,
    "food_type" TEXT,
    "food_image_url" TEXT,

    CONSTRAINT "Food_pkey" PRIMARY KEY ("food_id")
);

-- CreateTable
CREATE TABLE "Food_Translations" (
    "translation_id" SERIAL NOT NULL,
    "food_id" INTEGER NOT NULL,
    "language_code" TEXT NOT NULL,
    "food_name_tl" TEXT,
    "food_description_tl" TEXT,
    "food_price_tl" DECIMAL(65,30),

    CONSTRAINT "Food_Translations_pkey" PRIMARY KEY ("translation_id")
);

-- CreateTable
CREATE TABLE "Menu" (
    "menu_id" SERIAL NOT NULL,
    "menu_name" TEXT NOT NULL,
    "menu_description" TEXT,
    "active_from" TIMESTAMP(3) NOT NULL,
    "active_until" TIMESTAMP(3) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Menu_pkey" PRIMARY KEY ("menu_id")
);

-- CreateTable
CREATE TABLE "Menu_Item" (
    "menu_item_id" SERIAL NOT NULL,
    "menu_id" INTEGER NOT NULL,
    "food_id" INTEGER NOT NULL,
    "is_available" BOOLEAN NOT NULL DEFAULT true,
    "display_order" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Menu_Item_pkey" PRIMARY KEY ("menu_item_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Menu_Item_menu_id_food_id_key" ON "Menu_Item"("menu_id", "food_id");

-- AddForeignKey
ALTER TABLE "Food_Translations" ADD CONSTRAINT "Food_Translations_food_id_fkey" FOREIGN KEY ("food_id") REFERENCES "Food"("food_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Menu_Item" ADD CONSTRAINT "Menu_Item_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "Menu"("menu_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Menu_Item" ADD CONSTRAINT "Menu_Item_food_id_fkey" FOREIGN KEY ("food_id") REFERENCES "Food"("food_id") ON DELETE CASCADE ON UPDATE CASCADE;
