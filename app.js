
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
const toast = document.getElementById('toast');

let toastTimer;

function normalize(text) {
  return String(text || '')
    .toLocaleLowerCase('fa')
    .replace(/[يى]/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/ۀ/g, 'ه')
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
  }, 3200);
}

if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    const open = mainNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
  });

  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const sections = [
  {
    id: 'businesses',
    title: 'کسب و کارهای داراب',
    words: 'فروشگاه مغازه کافه رستوران پزشک خدمات بازار شرکت مشاغل'
  },
  {
    id: 'figures',
    title: 'مفاخر و نویسندگان داراب',
    words: 'نویسنده شاعر هنرمند شخصیت مشاهیر چهره فرهنگ ادبیات'
  },
  {
    id: 'discover',
    title: 'گردشگری داراب',
    words: 'گردشگری جاذبه دیدنی طبیعت سفر آبشار آثار باستانی'
  },
  {
    id: 'history',
    title: 'تاریخ داراب',
    words: 'تاریخ گذشته قدیم باستان خاطره عکس آرشیو'
  },
  {
    id: 'neighborhoods',
    title: 'محله ها و روستاهای داراب',
    words: 'محله روستا روستایی گویش آداب رسوم فرهنگ'
  },
  {
    id: 'products',
    title: 'محصولات محلی داراب',
    words: 'خرما مرکبات پرتقال لیمو کشاورزی محصولات تولید'
  }
];

function runSearch(query) {
  const q = normalize(query);

  if (!q) {
    showToast('یک عبارت برای جست‌وجو وارد کن.');
    return;
  }

  const terms = q.split(' ').filter(word => word.length > 1);
  let bestMatch = null;
  let bestScore = 0;

  sections.forEach(section => {
    const element = document.getElementById(section.id);
    if (!element) return;

    const content = normalize(
      section.title + ' ' +
      section.words + ' ' +
      section.id + ' ' +
      element.innerText
    );

    let score = 0;

    if (content.includes(q)) score += 10;

    terms.forEach(term => {
      if (content.includes(term)) score += 2;
    });

    if (score > bestScore) {
      bestScore = score;
      bestMatch = element;
    }
  });

  if (bestMatch && bestScore > 0) {
    bestMatch.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });

    showToast('بخش مرتبط پیدا شد. برای نتیجه دقیق‌تر، نام یا عبارت کامل را وارد کن.');
  } else {
    showToast('موردی در بخش‌های فعلی پیدا نشد. عبارت دیگری امتحان کن.');
  }
}

const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');

if (searchForm && searchInput) {
  searchForm.addEventListener('submit', event => {
    event.preventDefault();
    runSearch(searchInput.value);
  });
}

document.querySelectorAll('[data-search]').forEach(button => {
  button.addEventListener('click', () => {
    runSearch(button.dataset.search);
  });
});

const suggestForm = document.getElementById('suggestForm');

if (suggestForm) {
  suggestForm.addEventListener('submit', event => {
    event.preventDefault();

    const name = document
      .getElementById('suggestName')?.value.trim();

    if (!name) {
      showToast('لطفاً عنوان پیشنهاد را وارد کن.');
      return;
    }

    showToast(
      'این پیشنهاد هنوز ارسال نشده است؛ فرم برای ثبت واقعی به سرویس ذخیره‌سازی نیاز دارد.'
    );
  });
}
