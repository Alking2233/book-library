const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

const STRAPI_URL = 'http://localhost:1337/api';
const API_TOKEN = 'e918b7dd22e70276a748564334accaa32f0a4bee2658406724061646fd1ac4e10f19281618f829d2db4d949150b06234f84d5841128640a004b3e92f6132df879eb159f6aabcf68ed421566e5a6bbb862ebb1b13e2f7c509814d23fa2751293290b1b3e584fd5c220096cf05d0edd7226e71772b2c57be4a0c6919e56dc38785';

async function uploadImage(imagePath) {
  if (!imagePath) return null;
  
  const absolutePath = path.join(process.cwd(), imagePath);
  console.log(`📍 البحث عن: ${absolutePath}`);
  
  if (!fs.existsSync(absolutePath)) {
    console.warn(`⚠️ الصورة غير موجودة`);
    return null;
  }

  const formData = new FormData();
  formData.append('files', fs.createReadStream(absolutePath));

  try {
    const res = await axios.post(`${STRAPI_URL}/upload`, formData, {
      headers: { ...formData.getHeaders(), 'Authorization': `Bearer ${API_TOKEN}` }
    });
    return res.data[0].id;
  } catch (error) {
    console.error(`❌ فشل رفع الصورة:`, error.message);
    return null;
  }
}

async function importBlogs() {
  try {
    // 1. جلب المؤلفين
    const authorsRes = await axios.get(`${STRAPI_URL}/authors`, {
      headers: { 'Authorization': `Bearer ${API_TOKEN}` }
    });
    const authors = authorsRes.data.data;
    console.log(`📚 تم جلب ${authors.length} مؤلف`);

    // 2. جلب التصنيفات من جدول Category الموجود
    const categoriesRes = await axios.get(`${STRAPI_URL}/categories`, {
      headers: { 'Authorization': `Bearer ${API_TOKEN}` }
    });
    const categories = categoriesRes.data.data;
    console.log(`📂 تم جلب ${categories.length} تصنيف`);

    // إنشاء خريطة للأسماء لسهولة البحث
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.name] = cat.id;
    });

    // 3. استيراد المدونات
    const jsonPath = path.join(__dirname, '..', 'data', 'blogs.json');
    const { blogs } = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    console.log(`\n🚀 بدء استيراد ${blogs.length} مدونة...\n`);

    for (const blog of blogs) {
      console.log(`📝 معالجة: ${blog.Title}`);

      // رفع الصورة
      const imageId = await uploadImage(blog.imagePath);

      // البحث عن المؤلف
      const author = authors.find(a => a.Name === blog.authorName);
      
      // تجهيز التصنيفات (الربط بالأسماء)
      const blogCategoryIds = blog.categoryNames
        .map(name => categoryMap[name])
        .filter(id => id);

      const payload = {
        data: {
          Title: blog.Title,
          Description: blog.Description,
          content: blog.content,
        }
      };

      // ربط الصورة
      if (imageId) {
        payload.data.image = { connect: [imageId] };
      }

      // ربط المؤلف
      if (author) {
        payload.data.author = { connect: [author.id] };
      }

      // ربط التصنيفات
      if (blogCategoryIds.length > 0) {
        payload.data.categr_blogs = { connect: blogCategoryIds };
      }

      const response = await axios.post(`${STRAPI_URL}/blogs`, payload, {
        headers: { 'Authorization': `Bearer ${API_TOKEN}`, 'Content-Type': 'application/json' }
      });

      console.log(`✅ تم إضافة: ${blog.Title} (ID: ${response.data.data.id})\n`);
    }

    console.log('🎉 اكتمل استيراد المدونات بنجاح!');
  } catch (error) {
    console.error('💥 خطأ فادح:', error.response?.data?.error?.message || error.message);
    if (error.response?.data?.error?.details) {
      console.error('📋 التفاصيل:', JSON.stringify(error.response.data.error.details, null, 2));
    }
  }
}

importBlogs();