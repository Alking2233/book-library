const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data')

const STRAPI_URL = 'http://localhost:1337/api';
const API_TOKEN = 'e918b7dd22e70276a748564334accaa32f0a4bee2658406724061646fd1ac4e10f19281618f829d2db4d949150b06234f84d5841128640a004b3e92f6132df879eb159f6aabcf68ed421566e5a6bbb862ebb1b13e2f7c509814d23fa2751293290b1b3e584fd5c220096cf05d0edd7226e71772b2c57be4a0c6919e56dc38785'; // ⚠️ ضع التوكن هنا


// ✅ 1. تعريف دالة رفع الصورة بشكل صحيح
async function uploadImage(imagePath) {
  if (!imagePath) return null;
  
  const absolutePath = path.join(process.cwd(), imagePath);
  console.log(`📍 البحث عن الصورة: ${absolutePath}`);
  
  if (!fs.existsSync(absolutePath)) {
    console.warn(`⚠️ الصورة غير موجودة، سيتم تخطي رفعها`);
    return null;
  }

  const formData = new FormData();
  formData.append('files', fs.createReadStream(absolutePath));

  try {
    const res = await axios.post(`${STRAPI_URL}/upload`, formData, {
      headers: { ...formData.getHeaders(), 'Authorization': `Bearer ${API_TOKEN}` }
    });
    console.log(`✅ تم رفع الصورة بنجاح (ID: ${res.data[0].id})`);
    return res.data[0].id;
  } catch (error) {
    console.error(`❌ فشل رفع الصورة:`, error.message);
    return null;
  }
}

// ✅ 2. دالة الاستيراد الرئيسية
async function importAuthors() {
  try {
    const jsonPath = path.join(__dirname, '..', 'data', 'authors.json');
    console.log(`📂 قراءة البيانات من: ${jsonPath}`);
    
    const rawData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    const authors = rawData.authors;
    console.log(` بدء استيراد ${authors.length} مؤلف...\n`);

    for (const author of authors) {
      console.log(`📝 معالجة: ${author.Name}`);

      // رفع الصورة
      const imageId = await uploadImage(author.image);

      // تجهيز البيانات بنفس أسماء الحقول في Strapi
      const payload = {
        data: {
          Name: author.Name,
          Description: author.Description,
          whatsapp: author.whatsapp || '',
          facebook: author.facebook || '',
          instagram: author.instagram || '',
          telegram: author.telegram || '',
          linkedin: author.linkedin || '',
          youtube: author.youtube || ''
        }
      };

      // ربط الصورة إذا تم رفعها
      if (imageId) {
        payload.data.image = { connect: [imageId] };
      }

      // إرسال الطلب
      const response = await axios.post(`${STRAPI_URL}/authors`, payload, {
        headers: { 'Authorization': `Bearer ${API_TOKEN}`, 'Content-Type': 'application/json' }
      });

      console.log(`✅ تم إضافة: ${author.Name} (ID: ${response.data.data.id})\n`);
    }

    console.log('🎉 اكتمل استيراد المؤلفين بنجاح!');
  } catch (error) {
    console.error('💥 خطأ فادح:', error.response?.data?.error?.message || error.message);
    if (error.response?.data?.error?.details) {
      console.error('📋 التفاصيل:', JSON.stringify(error.response.data.error.details, null, 2));
    }
  }
}

// ✅ تشغيل السكربت
importAuthors();