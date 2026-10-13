
'use strict';

const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
const toast = document.getElementById('toast');
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const suggestForm = document.getElementById('suggestForm');

let toastTimer;

function normalize(text) {
  return String(text || '')
    .toLocaleLowerCase('fa')
    .replace(/[يى]/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/[ۀة]/g, 'ه')
    .replace(/[\u064B-\u065F\u0670]/g, '')
    .replace(/[\u200c\u200f\u200e]/g, ' ')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function showToast(message) {
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

if (menuToggle && mainNav) {
  menuToggle.setAttribute('aria-expanded', 'false');

  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');

    menuToggle.setAttribute(
      'aria-expanded',
      String(isOpen)
    );
  });

  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/*
  واژه‌های مرتبط با هر بخش سایت.
  برای افزودن اطلاعات جدید، کلیدواژه‌های واقعی
  را به بخش مناسب اضافه می‌کنیم.
*/

const searchSections = [
  {
    id: 'businesses',
    words: `
      کسب و کار کسب وکار فروشگاه مغازه کافه قهوه
      رستوران پزشک خدمات بازار شرکت مشاغل خرید
      تعمیرگاه آرایشگاه کارگاه تولیدی
    `
  },
  {
    id: 'figures',
    words: `
      مفاخر نویسنده نویسندگان شاعر شاعران هنرمند
      شخصیت مشاهیر چهره فرهنگ ادبیات پژوهشگر
      دانشمند معاصر تاریخی زندگی نامه زندگینامه
    `
  },
  {
    id: 'discover',
    words: `
      گردشگری داراب گردی جاذبه دیدنی طبیعت سفر
      آبشار آثار باستانی مکان دیدنی مسافرت
    `
  },
  {
    id: 'history',
    words: `
      تاریخ گذشته قدیم باستان خاطره عکس آرشیو
      دیروز امروز تاریخچه تصویر قدیمی
    `
  },
  {
    id: 'neighborhoods',
    words: `
      محله محله ها محله‌های روستا روستاها روستایی
      گویش آداب رسوم فرهنگ مناطق شهرستان
    `
  },
  {
    id: 'products',
    words: `
      محصول محصولات محلی خرما مرکبات پرتقال لیمو
      کشاورزی تولید باغداری میوه صنایع دستی
    `
  },
  {
    id: 'magazine',
    words: `
      مجله مقاله مطلب داستان قصه دانشنامه آرشیو
      گزارش یادداشت آموزش راهنما
    `
  },
  {
    id: 'submit',
    words: `
      پیشنهاد ثبت معرفی ارسال افزودن مشارکت
    `
  }
];

function getSearchableContent(element, extraWords) {
  const parts = [
    extraWords || '',
    element.id || '',
    element.getAttribute('aria-label') || '',
    element.innerText || '',
    element.textContent || ''
  ];

  if (element.dataset.keywords) {
    parts.push(element.dataset.keywords);
  }

  element.querySelectorAll('[data-keywords]').forEach(item => {
    parts.push(item.dataset.keywords || '');
  });

  return normalize(parts.join(' '));
}

function runSearch(query) {
  const q = normalize(query);

  if (!q) {
    showToast('یک عبارت برای جست‌وجو وارد کن.');
    searchInput?.focus();
    return;
  }

  const terms = [...new Set(
    q.split(' ').filter(term => term.length > 1)
  )];

  if (terms.length === 0) {
    showToast('لطفاً عبارت دقیق‌تری وارد کن.');
    return;
  }

  let bestElement = null;
  let bestScore = 0;
  let bestMatched = 0;

  for (const section of searchSections) {
    const element = document.getElementById(section.id);

    if (!element) continue;

    const content = getSearchableContent(
      element,
      section.words
    );

    let score = 0;
    let matched = 0;

    if (content.includes(q)) {
      score += 12;
    }

    for (const term of terms) {
      if (content.includes(term)) {
        score += 3;
        matched++;
      }
    }

    /*
      برای عبارت چندکلمه‌ای، بخشی که بیشترین
      تطابق را دارد در اولویت قرار می‌گیرد.
    */

    if (matched < Math.ceil(terms.length / 2)) {
      continue;
    }

    if (matched === terms.length) {
      score += 5;
    }

    if (score > bestScore) {
      bestScore = score;
      bestElement = element;
      bestMatched = matched;
    }
  }

  if (!bestElement || bestScore === 0) {
    showToast(
      'نتیجه‌ای در محتوای فعلی پیدا نشد. عبارت دیگری امتحان کن.'
    );
    return;
  }

  bestElement.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });

  if (terms.length > 1 && bestMatched < terms.length) {
    showToast(
      'نزدیک‌ترین بخش پیدا شد؛ برای نتیجه دقیق‌تر عبارت کوتاه‌تری امتحان کن.'
    );
  } else {
    showToast('بخش مرتبط پیدا شد.');
  }
}

if (searchForm && searchInput) {
  searchForm.addEventListener('submit', event => {
    event.preventDefault();
    runSearch(searchInput.value);
  });
}

document.querySelectorAll('[data-search]').forEach(button => {
  button.addEventListener('click', () => {
    const query = button.dataset.search;

    if (searchInput) {
      searchInput.value = query;
    }

    runSearch(query);
  });
});

/*
  فرم پیشنهادها در حال حاضر آزمایشی است.
  تا قبل از اتصال سرور، اطلاعات جایی ذخیره نمی‌شوند.
*/

if (suggestForm) {
  suggestForm.addEventListener('submit', event => {
    event.preventDefault();

    const nameInput =
      document.getElementById('suggestName');

    const name = nameInput?.value.trim();

    if (!name) {
      showToast('لطفاً نام یا عنوان پیشنهاد را وارد کن.');
      nameInput?.focus();
      return;
    }

    showToast(
      'پیشنهاد ثبت نشد؛ برای ذخیره اطلاعات باید سرور متصل شود.'
    );
  });
}
