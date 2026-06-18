// scripts/import-stats-slider.js
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

const STRAPI_URL = 'http://localhost:1337/api';
const API_TOKEN = 'c8c27050fff46c72bdb35de8c55232a55ecaa5a79b737e5543b50eda4e9356c19b645a733cadfba9d414e2846814f92c6f0a19d6c8e8a5a9bb413b03bad714927fe15f5fc34905037621ce0a4fdd4eb597519fbc64516dae3f9fea43ec373a4946abaa709a1964e66ed01249a6bba6a5c1b3ce1ae37127f2c4c2e1dfb7cd84a2'; // من Settings → API Tokens

async function uploadImageToStrapi(imagePath) {
  const absolutePath = path.resolve(__dirname, '..', imagePath);
  if (!fs.existsSync(absolutePath)) {
    console.warn(`⚠️ الصورة غير موجودة: ${absolutePath}`);
    return null;
  }

  const formData = new FormData();
  formData.append('files', fs.createReadStream(absolutePath));

  try {
    const res = await axios.post(`${STRAPI_URL}/upload`, formData, {
      headers: { ...formData.getHeaders(), 'Authorization': `Bearer ${API_TOKEN}` }
    });
    return res.data[0].id;
  } catch (err) {
    console.error(`❌ فشل رفع ${imagePath}:`, err.response?.data || err.message);
    return null;
  }
}

async function importStatsSlider() {
  try {
    const jsonPath = path.join(__dirname, '..', 'data', 'stats-slider.json');
    
    // ✅ التحقق من وجود الملف
    if (!fs.existsSync(jsonPath)) {
      throw new Error(`الملف غير موجود: ${jsonPath}\nأنشئ المجلد data وضع فيه stats-slider.json`);
    }

    // ✅ قراءة الملف والتحقق من صحته
    const fileContent = fs.readFileSync(jsonPath, 'utf8');
    let slidersData;
    
    try {
      slidersData = JSON.parse(fileContent);
    } catch (parseError) {
      throw new Error(`خطأ في صيغة JSON:\n${parseError.message}\n\nتأكد من:\n1. استخدام علامات " مزدوجة\n2. عدم وجود فاصلة بعد آخر عنصر\n3. عدم وجود مسافات زائدة`);
    }

    const { sliders } = slidersData;
    
    if (!sliders || !Array.isArray(sliders)) {
      throw new Error('الملف يجب أن يحتوي على مفتاح "sliders" بمصفوفة');
    }

    console.log(`📊 بدء استيراد ${sliders.length} سلايدر...`);

    for (const slider of sliders) {
      console.log(`\n📥 معالجة: ${slider.Title}`);

      const [heroImgId, bgLightId, bgDarkId] = await Promise.all([
        slider.hero_img ? uploadImageToStrapi(slider.hero_img) : Promise.resolve(null),
        slider.bg_light ? uploadImageToStrapi(slider.bg_light) : Promise.resolve(null),
        slider.bg_dark ? uploadImageToStrapi(slider.bg_dark) : Promise.resolve(null)
      ]);

      const payload = {
        data: {
          Title: slider.Title,
          SubTitle: slider.SubTitle,
          Description: slider.Description,
          btnText1: slider.btnText1,
          btnLink1: slider.btnLink1,
          btnText2: slider.btnText2,
          btnLink2: slider.btnLink2,
          shape1: slider.shape1 || null,
          shape2: slider.shape2 || null
        }
      };

      if (heroImgId) payload.data.hero_img = { connect: [heroImgId] };
      if (bgLightId) payload.data.bg_light = { connect: [bgLightId] };
      if (bgDarkId) payload.data.bg_dark = { connect: [bgDarkId] };

      const res = await axios.post(`${STRAPI_URL}/sliders`, payload, {
        headers: { 
          'Authorization': `Bearer ${API_TOKEN}`, 
          'Content-Type': 'application/json' 
        }
      });

      console.log(`✅ تم إضافة السلايدر بنجاح! (ID: ${res.data.data.id})`);
    }

    console.log('\n🎉 اكتملت العملية بنجاح!');
  } catch (error) {
    console.error('💥 خطأ فادح:', error.message);
    if (error.response) {
      console.error('التفاصيل:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

importStatsSlider();