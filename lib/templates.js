// ── ReplyJet Templates Library ───────────────────────────────────────
export const TEMPLATES = [
  // ── Angry / Complaint ────────────────────────────────────────────
  {
    id: "angry_1",
    category: "complaint",
    label: "تأخير التوصيل",
    preview: "عميل زعلان من تأخير الأوردر",
    text: "الأوردر بتاعي متأخر جداً وعايز أعرف هيوصل إمتى",
  },
  {
    id: "angry_2",
    category: "complaint",
    label: "منتج تالف",
    preview: "عميل استلم منتج مكسور",
    text: "المنتج اللي استلمته كان مكسور وعايز استرداد كامل",
  },
  {
    id: "angry_3",
    category: "complaint",
    label: "خدمة سيئة",
    preview: "عميل يشكو من التعامل",
    text: "خدمة العملاء بتاعتكم سيئة جداً ومش هينفعش أتعامل معاكم تاني",
  },
  {
    id: "angry_4",
    category: "complaint",
    label: "مشكلة في الفاتورة",
    preview: "خصموا مبلغ غلط",
    text: "خصمتوا مني مبلغ غلط وعايز رد فلوسي فوراً",
  },

  // ── Sales / Follow Up ────────────────────────────────────────────
  {
    id: "sales_1",
    category: "close_sale",
    label: "استفسار عن السعر",
    preview: "عميل بيسأل عن الأسعار",
    text: "كام سعر المنتج وفيه خصومات؟",
  },
  {
    id: "sales_2",
    category: "close_sale",
    label: "مقارنة منتجات",
    preview: "عميل بيقارن بين خيارين",
    text: "إيه الفرق بين الباقة الأساسية والبريميوم؟",
  },
  {
    id: "sales_3",
    category: "close_sale",
    label: "طلب عرض خاص",
    preview: "عميل بيطلب ديسكاونت",
    text: "عندي ميزانية محدودة، تقدروا تعملولي عرض أحسن؟",
  },
  {
    id: "follow_1",
    category: "follow_up",
    label: "عميل مش رد",
    preview: "عميل كان مهتم وسكت",
    text: "اتكلمنا الأسبوع اللي فات بس لسه مش متأكد",
  },
  {
    id: "follow_2",
    category: "follow_up",
    label: "بعد التجربة المجانية",
    preview: "عميل خلص trial",
    text: "جربت المنتج بس محتاج وقت أفكر أكتر",
  },

  // ── General / Normal ─────────────────────────────────────────────
  {
    id: "normal_1",
    category: "normal",
    label: "استفسار عام",
    preview: "سؤال بسيط عن المنتج",
    text: "عايز أعرف أكتر عن المنتج بتاعكم",
  },
  {
    id: "normal_2",
    category: "normal",
    label: "طلب معلومات توصيل",
    preview: "عميل بيسأل عن الشحن",
    text: "بتوصلوا فين وكام يوم بيأخد التوصيل؟",
  },
  {
    id: "normal_3",
    category: "normal",
    label: "طلب ريسيت كلمة السر",
    preview: "عميل نسي الباسورد",
    text: "نسيت كلمة السر الخاصة بيا، تقدروا تساعدوني؟",
  },
  {
    id: "normal_4",
    category: "normal",
    label: "شكر وتقدير",
    preview: "عميل راضي وبيشكر",
    text: "شكراً جزيلاً على الخدمة الممتازة، استلمت الأوردر وكان تمام",
  },
  {
    id: "normal_5",
    category: "normal",
    label: "English: Delivery inquiry",
    preview: "Customer asking about delivery",
    text: "Hi, I placed an order 3 days ago and haven't received any tracking info yet.",
  },
  {
    id: "normal_6",
    category: "normal",
    label: "English: Refund request",
    preview: "Customer wants a refund",
    text: "I would like to request a refund for my last order as it didn't match the description.",
  },
];

export const TEMPLATE_CATEGORIES = [
  { value: "all",        label: "All",       icon: "🗂️" },
  { value: "complaint",  label: "Complaint", icon: "😤" },
  { value: "close_sale", label: "Sales",     icon: "💰" },
  { value: "follow_up",  label: "Follow Up", icon: "📩" },
  { value: "normal",     label: "Normal",    icon: "💬" },
];
