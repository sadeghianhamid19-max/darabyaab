const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
const toast = document.getElementById('toast');
let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
}
menuToggle.addEventListener('click', () => {
  const open = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});
mainNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mainNav.classList.remove('open')));

function runSearch(query) {
  const q = query.trim().toLocaleLowerCase('fa');
  if (!q) { showToast('یک عبارت برای جست‌وجو وارد کن.'); return; }
  const sections = [
    {id:'businesses', words:'کسب و کار فروشگاه کافه خدمات بازار محلی'},
    {id:'figures', words:'مفاخر چهره شخصیت نویسنده شاعر هنرمند تاریخی معاصر فرهنگ هنر'},
    {id:'discover', words:'گردشگری داراب گردی دیدنی طبیعت تاریخ داراب شناسی'},
    {id:'history', words:'تاریخ گذشته قدیم دیروز امروز عکس قدیمی آرشیو'},
    {id:'neighborhoods', words:'محله محله‌های روستا روستاها فرهنگ گویش آیین خاطره'},
    {id:'products', words:'محصول خرما مرکبات کشاورزی تولید پرتقال لیمو'}
  ];
  const match = sections.find(s => (s.words + ' ' + s.id).includes(q) || q.split(/\s+/).some(word => word.length > 2 && (s.words + ' ' + s.id).includes(word)));
  if (match) {
    document.getElementById(match.id).scrollIntoView({behavior:'smooth'});
    showToast('بخش مرتبط را برات باز کردم. برای جست‌وجوی دقیق‌تر، فهرست محتوا در نسخه بعدی اضافه می‌شود.');
  } else {
    showToast('جست‌وجوی کامل در نسخه بعدی فعال می‌شود؛ فعلاً از بخش‌های سایت استفاده کن.');
  }
}
document.getElementById('searchForm').addEventListener('submit', e => {
  e.preventDefault();
  runSearch(document.getElementById('searchInput').value);
});
document.querySelectorAll('[data-search]').forEach(btn => btn.addEventListener('click', () => runSearch(btn.dataset.search)));

document.getElementById('suggestForm').addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('suggestName').value.trim();
  const type = document.getElementById('suggestType').value;
  if (!name) return;
  showToast('پیشنهاد «' + name + '» آماده‌ی ثبت است؛ برای ارسال واقعی باید فرم به سرور متصل شود.');
  e.target.reset();
});
