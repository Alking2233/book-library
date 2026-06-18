// generate-pdfs.js - باستخدام Puppeteer (دعم كامل للعربية)
import puppeteer from 'puppeteer';
import { mkdirSync, existsSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 📚 بيانات الكتب
const books = [
  {
    title: 'لا تحزن',
    author: 'د. عائض القرني',
    publisher: 'دار مدارك للنشر',
    description: 'كتاب في المواعظ والحكم والعبر مستمدة من القرآن والسنة'
  },
  {
    title: 'يوتوبيا',
    author: 'أحمد خالد توفيق',
    publisher: 'دار الكرمة',
    description: 'رواية ديستوبية مصرية تتنبأ بمستقبل مصر عام 2025 '
  },
  {
    title: 'فن اللامبالاة',
    author: 'مارك مانسون',
    publisher: 'دار تنوير',
    description: 'دليل غير تقليدي لحياة أفضل عبر اختيار ما تهتم به حقاً'
  },
  {
    title: 'رجال في الشمس',
    author: 'غسان كنفاني',
    publisher: 'دار الآداب',
    description: 'رواية فلسطينية كلاسيكية عن معاناة اللاجئين'
  },
  {
    title: 'الخيميائي',
    author: 'باولو كويلو',
    publisher: 'دار كاريزما',
    description: 'رواية عالمية ملهمة عن البحث عن الكنز وتحقيق الأحلام'
  },
  {
    title: 'في ظلال القرآن',
    author: 'سيد قطب',
    publisher: 'دار الشروق',
    description: 'تفسير القرآن الكريم بأسلوب أدبي فريد'
  },
  {
    title: 'العادات الذرية',
    author: 'جيمس كلير',
    publisher: 'دار تنوير',
    description: 'دليل عملي لبناء عادات جيدة والتخلص من السيئة'
  },
  {
    title: 'مقدمة ابن خلدون',
    author: 'عبد الرحمن بن خلدون',
    publisher: 'دار الفكر',
    description: ' obra كلاسيكية في التاريخ وعلم الاجتماع'
  },
  {
    title: 'مئة عام من العزلة',
    author: 'غابرييل غارسيا ماركيز',
    publisher: 'دار الآداب',
    description: 'رواية ملحمية عالمية عن عائلة بوينديا عبر سبعة أجيال'
  },
  {
    title: 'قصص الأطفال المصورة',
    author: 'مجموعة مؤلفين',
    publisher: 'دار المعارف',
    description: 'مجموعة قصص تعليمية وممتعة للأطفال مع رسومات جذابة'
  }
];

// 📁 مجلد الحفظ
const outputDir = join(__dirname, 'public', 'pdfs');
if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

console.log('🚀 جاري إنشاء ملفات PDF بالعربية...\n');

// تشغيل Puppeteer
(async () => {
  const browser = await puppeteer.launch();

  for (const book of books) {
    const safeName = book.title.replace(/[^\u0600-\u06FF0-9a-zA-Z]/g, '-');
    const filePath = join(outputDir, `${safeName}.pdf`);

    // HTML كامل مع CSS
    const html = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <title>${book.title}</title>
        <style>
        @font-face {
          font-family: 'Amiri';
          src: url('file:///D:/Book-store/book-store-server/public/fonts/Amiri-Regular.ttf');
          font-weight: normal;
          }
          body {
          font-family: 'Amiri', 'Traditional Arabic', serif;
          }
          @page {
            size: A4;
            margin: 0;
          }
          body {
            font-family: 'Traditional Arabic', 'Arial', 'Tahoma', sans-serif;
            margin: 0;
            padding: 0;
            background: white;
          }
          
          /* الصفحة الأولى: الغلاف */
          .cover {
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            border: 8px solid #2c3e50;
            margin: 20px;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 0 0 5px #3498db, 0 10px 40px rgba(0,0,0,0.1);
          }
          
          .cover h1 {
            font-size: 56px;
            color: #2c3e50;
            margin: 0 0 40px 0;
            font-weight: bold;
          }
          
          .author {
            font-size: 32px;
            color: #e74c3c;
            margin: 20px 0;
            font-weight: bold;
          }
          
          .publisher {
            font-size: 22px;
            color: #7f8c8d;
            margin: 15px 0;
          }
          
          .description {
            font-size: 20px;
            color: #34495e;
            margin: 30px 0;
            text-align: center;
            max-width: 80%;
            line-height: 1.8;
          }
          
          .footer {
            margin-top: 60px;
            font-size: 16px;
            color: #95a5a6;
            text-align: center;
          }
          
          /* الصفحة الثانية: المحتوى */
          .content {
            height: 100vh;
            border: 8px solid #2c3e50;
            margin: 20px;
            border-radius: 20px;
            padding: 60px 40px;
            box-shadow: 0 0 0 5px #3498db;
          }
          
          .chapter-title {
            font-size: 36px;
            color: #2c3e50;
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 3px solid #3498db;
            padding-bottom: 20px;
          }
          
          .content-text {
            font-size: 20px;
            color: #2c3e50;
            line-height: 2;
            text-align: justify;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <!-- الصفحة الأولى -->
        <div class="cover">
          <h1>${book.title}</h1>
          <div class="author">${book.author}</div>
          <div class="publisher">${book.publisher}</div>
          <div class="description">${book.description}</div>
          <div class="footer">
            <div>نسخة تجريبية - للأغراض التعليمية فقط</div>
            <div style="margin-top: 10px;">جميع الحقوق محفوظة ©</div>
          </div>
        </div>
        
        <!-- الصفحة الثانية -->
        <div class="content">
          <h2 class="chapter-title">الفصل الأول: مقدمة</h2>
          <div class="content-text">
            <p>هذا نص تجريبي يمثل محتوى الكتاب. يمكنك استبدال هذا المحتوى بالنص الحقيقي لاحقاً.</p>
            <p>الغرض من هذا الملف هو عرض ميزة التحميل في مشروع متجر الكتب الخاص بك.</p>
            <p style="margin-top: 30px; text-align: center; color: #7f8c8d;">
              --- نهاية النموذج التجريبي ---
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    // إنشاء PDF
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.pdf({
      path: filePath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px'
      }
    });

    console.log(`✅ تم: ${safeName}.pdf`);
  }

  await browser.close();
  console.log('\n🎉 اكتمل إنشاء جميع الملفات!');
  console.log(`📁 الموقع: ${outputDir}`);
})();