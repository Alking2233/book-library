// new-books.js
// ✅ تأكد من وضع التوكن الخاص بك هنا قبل التشغيل
const API_TOKEN = "c8c27050fff46c72bdb35de8c55232a55ecaa5a79b737e5543b50eda4e9356c19b645a733cadfba9d414e2846814f92c6f0a19d6c8e8a5a9bb413b03bad714927fe15f5fc34905037621ce0a4fdd4eb597519fbc64516dae3f9fea43ec373a4946abaa709a1964e66ed01249a6bba6a5c1b3ce1ae37127f2c4c2e1dfb7cd84a2";

const STRAPI_URL = "http://localhost:1337/api";

const booksData = [
  {
    Title: "سَابِينْس: تاريخ مختصر للجنس البشري",
    slug: "sapiens",
    shortDescription: "رحلة مذهلة عبر تاريخ البشرية من عصور ما قبل التاريخ إلى العصر الحديث",
    Description: "يأخذنا يوفال نوال هراري في رحلة مثيرة عبر 70 ألف سنة من تاريخ البشرية، مستكشفاً كيف سيطر الإنسان العاقل على العالم، وكيف شكلت الثورات الزراعية والمعرفية مجتمعاتنا الحالية.",
    price: 55, author: "يوفال نوال هراري", publisher: "دار التنوير",
    publishedDate: "2011-09-04", pages: 464, stock: 40, isbn: "9789776881006",
    Available: true, category_ids: [19] 
  },
  {
    Title: "الأب الغني والأب الفقير",
    slug: "rich-dad-poor-dad",
    shortDescription: "كتاب رائد في الثقافة المالية وتغيير طريقة التفكير حول المال",
    Description: "يقارن روبرت كيوساكي بين فلسفتين مختلفتين في الحياة والمال: فلسفة والده الفقير (الموظف)، وفلسفة والده الغني (المستثمر). يعلم الكتاب كيف تجعل المال يعمل لأجلك.",
    price: 45, author: "روبرت كيوساكي", publisher: "دار جرير",
    publishedDate: "1997-04-08", pages: 207, stock: 50, isbn: "9786140116856",
    Available: true, category_ids: [23]
  },
  {
    Title: "نادي الخامسة صباحاً",
    slug: "5am-club",
    shortDescription: "دليل عملي للاستيقاظ مبكراً وزيادة الإنتاجية والسيطرة على حياتك",
    Description: "كتاب روبرن شارما يشرح كيف يمكن للاستيقاظ في الخامسة صباحاً أن يغير حياتك بالكامل، من خلال روتين الصباح المكون من ساعة واحدة يركز على الحركة والتأمل والنمو.",
    price: 42, author: "روبن شارما", publisher: "دار الفجر",
    publishedDate: "2018-05-01", pages: 336, stock: 35, isbn: "9789774197345",
    Available: true, category_ids: [17]
  },
  {
    Title: "التفكير بسرعة وببطء",
    slug: "thinking-fast-and-slow",
    shortDescription: "استكشاف الأنظمة العقلية التي تتحكم في قراراتنا وأحكامنا",
    Description: "يعرض دانيال كانمان (الحائز على نوبل) نظريته الثورية حول النظامين الذين يتحكمان في طريقة تفكيرنا: النظام السريع الحدسي، والنظام البطيء المنطقي.",
    price: 60, author: "دانيال كانمان", publisher: "دار تنوير",
    publishedDate: "2011-10-25", pages: 499, stock: 25, isbn: "9789776421776",
    Available: true, category_ids: [17]
  },
  {
    Title: "الرسول",
    slug: "the-prophet",
    shortDescription: "تحفة جبران خليل جبران الشعرية عن الحب والزواج والحياة",
    Description: "يجمع هذا الكتاب بين الحكمة الشرقية والشعر الغربي، حيث يتناول النبي مصطفى الحكيم موضوعات الحياة المختلفة مثل الحب، الزواج، الأبناء، العمل، والموت بأسلوب شاعري مؤثر.",
    price: 30, author: "جبران خليل جبران", publisher: "دار الآداب",
    publishedDate: "1923-01-01", pages: 112, stock: 45, isbn: "9789953891217",
    Available: true, category_ids: [15]
  },
  {
    Title: "قواعد العشق الأربعون",
    slug: "40-rules-of-love",
    shortDescription: "رواية ملهمة عن العلاقة الروحية بين جلال الدين الرومي وشمس التبريزي",
    Description: "تدور الأحداث حول امرأة أمريكية تكتشف أسرار الصوفية من خلال قراءة رواية تاريخية. الكتاب يمزج بين الحاضر والماضي مستعرضاً القواعد الأربعين للحب.",
    price: 48, author: "إليف شافاق", publisher: "دار النيل",
    publishedDate: "2009-01-01", pages: 496, stock: 20, isbn: "9789776590847",
    Available: true, category_ids: [11]
  },
  {
    Title: "فن الحرب",
    slug: "art-of-war",
    shortDescription: "أقدم وأشهر كتاب في الاستراتيجية العسكرية والقيادية",
    Description: "يُعد كتاب \"فن الحرب\" لسون تزو مرجعاً أساسياً في الاستراتيجية، ورغم أن أصوله عسكرية، إلا أنه يُطبق اليوم في عالم الأعمال والإدارة والتفاوض.",
    price: 25, author: "سون تزو", publisher: "دار ابن كثير",
    publishedDate: "2005-01-01", pages: 80, stock: 60, isbn: "9789953101234",
    Available: true, category_ids: [23]
  },
  {
    Title: "48 قانوناً للقوة",
    slug: "48-laws-of-power",
    shortDescription: "دليل عملي لفهم ديناميكيات القوة والتلاعب في العلاقات الاجتماعية",
    Description: "يستعرض روبرت غرين 48 قانوناً تاريخياً للقوة، مستخلصاً الدروس من حياة قادة وسياسيين وفنانين عبر العصور. كتاب يفتح البصيرة حول طبيعة السلوك البشري.",
    price: 70, author: "روبرت غرين", publisher: "دار التنوير",
    publishedDate: "1998-09-01", pages: 452, stock: 15, isbn: "9789776421226",
    Available: true, category_ids: [23]
  },
  {
    Title: "إيكيجاي: السر الياباني لحياة طويلة وسعيدة",
    slug: "ikigai",
    shortDescription: "كيف تجد شغفك وهدفك في الحياة لتحقيق السعادة الحقيقية",
    Description: "يستكشف هذا الكتاب مفهوم \"إيكيجاي\" الياباني، وهو نقطة التقاطع بين ما تحبه، وما تجيده، وما يحتاجه العالم، وما يمكنك أن تُدفع مقابله.",
    price: 35, author: "هيكتور غارسيا", publisher: "دار كاروزما",
    publishedDate: "2016-08-01", pages: 208, stock: 40, isbn: "9789776416178",
    Available: true, category_ids: [17]
  },
  {
    Title: "برد مستعجل",
    slug: "bareed-mistaajil",
    shortDescription: "مجموعة قصصية مميزة تعكس واقع الشباب العربي المعاصر",
    Description: "مجموعة قصصية كتبها عدد من الشباب اللبناني، تحكي قصصاً قصيرة عن الحب، الحرب، الهجرة، والصداقة بأسلوب واقعي ومؤثر يعبر عن جيل ما بعد الحرب.",
    price: 40, author: "مجموعة مؤلفين", publisher: "دار الفنون",
    publishedDate: "2009-01-01", pages: 320, stock: 30, isbn: "9789953890234",
    Available: true, category_ids: [11]
  }
];

async function runImport() {
  console.log("🚀 بدء استيراد الكتب...");
  
  for (const book of booksData) {
    try {
      const response = await fetch(`${STRAPI_URL}/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_TOKEN}`
        },
        body: JSON.stringify({ data: book })
      });

      if (response.ok) {
        console.log(`✅ تم إضافة: ${book.Title}`);
      } else {
        const err = await response.json();
        console.error(`❌ فشل في إضافة ${book.Title}:`, err.error?.message || "خطأ غير معروف");
      }
    } catch (error) {
      console.error(`❌ خطأ في الاتصال:`, error.message);
    }
  }
  console.log("🎉 انتهى الاستيراد!");
}

runImport();