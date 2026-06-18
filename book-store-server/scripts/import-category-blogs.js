const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

const STRAPI_URL = 'http://localhost:1337';
const API_TOKEN = 'e918b7dd22e70276a748564334accaa32f0a4bee2658406724061646fd1ac4e10f19281618f829d2db4d949150b06234f84d5841128640a004b3e92f6132df879eb159f6aabcf68ed421566e5a6bbb862ebb1b13e2f7c509814d23fa2751293290b1b3e584fd5c220096cf05d0edd7226e71772b2c57be4a0c6919e56dc38785';


// ✅ الدالة الصحيحة للرفع
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
    const res = await axios.post(`${STRAPI_URL}/api/upload`, formData, {
      headers: { 
        ...formData.getHeaders(), 
        'Authorization': `Bearer ${API_TOKEN}` 
      }
    });
    console.log(`✅ تم رفع الصورة (ID: ${res.data[0].id})`);
    return res.data[0].id;
  } catch (error) {
    console.error(`❌ فشل رفع الصورة:`, error.response?.data || error.message);
    return null;
  }
}

async function importCategoryBlogs() {
  try {
    // 1. جلب المدونات
    console.log('📚 الخطوة 1: جلب المدونات...');
    const blogsRes = await axios.get(`${STRAPI_URL}/api/blogs`, {
      headers: { 'Authorization': `Bearer ${API_TOKEN}` }
    });
    const blogs = blogsRes.data.data;
    console.log(`✅ تم جلب ${blogs.length} مدونة\n`);

    // إنشاء خريطة للأسماء
    const blogMap = {};
    blogs.forEach(blog => {
      const title = blog.Title || blog.attributes?.Title;
      blogMap[title] = blog.id;
    });

    // 2. قراءة ملف التصنيفات
    const jsonPath = path.join(__dirname, '..', 'data', 'category-blogs.json');
    const { categoryBlogs } = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    console.log(`🚀 بدء استيراد ${categoryBlogs.length} تصنيف...\n`);

    // 3. استيراد كل تصنيف
    for (const item of categoryBlogs) {
      console.log(`📝 معالجة: ${item.name}`);

      const imageId = await uploadImage(item.imagePath);
      const blogId = blogMap[item.blogTitle];

      if (!blogId) {
        console.warn(`⚠️ المدونة غير موجودة: ${item.blogTitle}`);
        continue;
      }

      const payload = {
        data: {
          name: item.name,
          blog: blogId
        }
      };

      if (imageId) {
        payload.data.image = imageId;
      }

      // ✅ استخدام الرابط الصحيح: categry-blogs (بدون o)
      const response = await axios.post(
        `${STRAPI_URL}/api/categry-blogs`,
        payload,
        {
          headers: { 
            'Authorization': `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log(`✅ تم إضافة: ${item.name} (ID: ${response.data.data.id})\n`);
    }

    console.log('🎉 اكتمل استيراد تصنيفات المدونات بنجاح!');
  } catch (error) {
    console.error('💥 خطأ فادح:', error.response?.data?.error?.message || error.message);
    if (error.response?.data?.error) {
      console.error('📋 التفاصيل:', JSON.stringify(error.response.data.error, null, 2));
    }
  }
}

importCategoryBlogs();