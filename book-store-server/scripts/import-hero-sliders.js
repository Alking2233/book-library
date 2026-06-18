const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

const STRAPI_URL = 'http://localhost:1337/api';
const API_TOKEN = 'c8c27050fff46c72bdb35de8c55232a55ecaa5a79b737e5543b50eda4e9356c19b645a733cadfba9d414e2846814f92c6f0a19d6c8e8a5a9bb413b03bad714927fe15f5fc34905037621ce0a4fdd4eb597519fbc64516dae3f9fea43ec373a4946abaa709a1964e66ed01249a6bba6a5c1b3ce1ae37127f2c4c2e1dfb7cd84a2'; // ⚠️ ضع التوكن هنا

async function uploadImage(imagePath) {
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
    return res.data[0].id;
  } catch (error) {
    console.error(`❌ فشل رفع الصورة:`, error.message);
    return null;
  }
}

async function importHeroSliders() {
  try {
    const jsonPath = path.join(__dirname, '..', 'data', 'hero-sliders.json');
    console.log(`📂 قراءة البيانات من: ${jsonPath}`);
    
    const { sliders } = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    console.log(`🚀 بدء استيراد ${sliders.length} سلايدر...\n`);

    for (const slider of sliders) {
      console.log(` معالجة: ${slider.title}`);

      const imageId = await uploadImage(slider.imagePath);

      // ✅ مطابقة تامة لأسماء الحقول في Strapi
      const payload = {
        data: {
          title: slider.title,
          subtitle: slider.subtitle,
          description: slider.description,
          buttontext: slider.buttontext,
          buttonlink: slider.buttonlink,
          order: slider.order,
        }
      };

      // ربط الصورة إذا تم رفعها
      if (imageId) {
        payload.data.backgroundimage = { connect: [imageId] };
      }

      const response = await axios.post(`${STRAPI_URL}/hero-sliders`, payload, {
        headers: { 'Authorization': `Bearer ${API_TOKEN}`, 'Content-Type': 'application/json' }
      });

      console.log(`✅ تم إضافة: ${slider.title} (ID: ${response.data.data.id})\n`);
    }

    console.log('🎉 اكتمل استيراد Hero Sliders بنجاح!');
  } catch (error) {
    console.error(' خطأ فادح:', error.response?.data?.error?.message || error.message);
    if (error.response?.data?.error?.details) {
      console.error('📋 التفاصيل:', JSON.stringify(error.response.data.error.details, null, 2));
    }
  }
}

importHeroSliders();