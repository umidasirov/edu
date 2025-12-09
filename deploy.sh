#!/bin/bash
# React build qilish
npm run build

# Build fayllarni ko'chirish
rm -rf /var/www/edumark.uz/build
cp -r build /var/www/edumark.uz/

# Nginxni qayta ishga tushirish
sudo systemctl restart nginx
