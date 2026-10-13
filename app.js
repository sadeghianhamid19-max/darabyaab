
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
}, 3500);
}

if (menuToggle && mainNav) {
menuToggle.addEventListener('click', () => {
const isOpen = mainNav.classList.toggle('open');
menuToggle.setAttribute('aria-expanded', String(isOpen));
});

mainNav.querySelectorAll('a').forEach(link => {
link.addEventListener('click', () => {
mainNav.classList.remove('open');
menuToggle.setAttribute('aria-expanded', 'false');
});
});
}

const searchSections = [
{
id: 'businesses',
words: 'کسب و کار کسب وکار فروشگاه مغازه کافه قهوه رستوران پزشک خدمات بازار شرکت مشاغل خرید'
},
{
id: 'figures',
words: 'مفاخر نویسنده نویسندگان شاعر شاعران هنرمند شخصیت مشاهیر چهره فرهنگ ادبیات'
},
{
id: 'discover',
words: 'گردشگری داراب گردی جاذبه دیدنی طبیعت سفر آبشار آثار باستانی'
},
{
id: 'history',
words: 'تاریخ گذشته قدیم باستان خاطره عکس آرشیو دیروز امروز'
},
{
id: 'neighborhoods',
words: 'محله محله ها محله‌های روستا روستاها روستایی گویش آداب رسوم فرهنگ'
},
{
id: 'products',
words: 'محصول محصولات محلی خرما مرکبات پرتقال لیمو کشاورزی تولید'
},
{
id: 'magazine',
words: 'مجله مقاله مطلب داستان قصه دانشنامه آرشیو'
},
{
id: 'submit',
words: 'پیشنهاد ثبت معرفی ارسال افزودن'
}
];

function runSearch(query) {
const q = normalize(query);

if (!q) {
showToast('یک عبارت برای جست‌وجو وارد کن.');
return;
}

const terms = q.split(' ').filter(term => term.length > 1);
let bestElement = null;
let bestScore = 0;

for (const section of searchSections) {
const element = document.getElementById(section.id);
if (!element) continue;

const content = normalize(
  section.words + ' ' +
  section.id.replace(/([A-Z])/g, ' $1') + ' ' +
  element.innerText
);

let score = 0;

if (content.includes(q)) score += 10;

for (const term of terms) {
  if (content.includes(term)) score += 2;
}

if (score > bestScore) {
  bestScore = score;
  bestElement = element;
}

}

if (bestElement && bestScore > 0) {
bestElement.scrollIntoView({
behavior: 'smooth',
block: 'start'
});

showToast('بخش مرتبط پیدا شد؛ مطالب این بخش را ببین.');

} else {
showToast('در محتوای فعلی نتیجه‌ای پیدا نشد. عبارت دیگری امتحان کن.');
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
runSearch(button.dataset.search);
});
});

if (suggestForm) {
suggestForm.addEventListener('submit', event => {
event.preventDefault();

const name = document.getElementById('suggestName')?.value.trim();

if (!name) {
  showToast('لطفاً نام یا عنوان پیشنهاد را وارد کن.');
  return;
}

showToast('این پیشنهاد هنوز ذخیره یا ارسال نشده است؛ اتصال سرور لازم است.');

});
}
