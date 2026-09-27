(() => {
  const { event, names, assets, links, texts } = window.SITE_CONFIG;
  const $ = (selector) => document.querySelector(selector);
  const setText = (selector, value) => { const element = $(selector); if (element && value != null) element.textContent = value; };
  const setHref = (selector, value) => { const element = $(selector); if (element && value) element.href = value; };
  const fullName = `${names.groomArabic} & ${names.brideArabic}`;
  const description = `${event.dateText} • ${event.venueName}`;
  document.title = `${texts.title} ${fullName}`;
  setText('#knockHint', texts.coverHint);
  setText('.stage__kicker', texts.title);
  setText('.cal-title', texts.calendar);
  setText('.cal-top', event.calendarMonth);
  setText('.cal-wd', event.calendarWeekday);
  setText('.cal-day', event.calendarDay);
  setText('.cal-time', event.timeText);
  setText('#da3wa-form-wrap h3', texts.rsvpTitle);
  setText('#da3wa-form-wrap .sub', texts.rsvpSubtitle);
  setText('#rsvpDelivery', texts.rsvpDelivery);
  setText('#da3wa-rsvp-form .send', texts.rsvpSubmit);
  setText('.wishes-h h3', texts.wishesTitle);
  setHref('.credit-made a', links.brand);
  setHref('.credit-cta', links.create);
  setHref('.credit-ig', links.instagram);
  setHref('.dc-order', links.order);
  const videoAssets = [['#doorVid', assets.doorPoster, assets.doorVideo], ['#heroVid', assets.heroPoster, assets.heroVideo]];
  for (const [selector, poster, source] of videoAssets) {
    const video = $(selector);
    if (video) { video.poster = poster; video.querySelector('source').src = source; }
  }
  const meta = (selector, content) => { const el = $(selector); if (el) el.content = content; };
  meta('meta[name="description"]', description);
  meta('meta[property="og:title"]', document.title);
  meta('meta[property="og:description"]', description);
  meta('meta[property="og:image"]', new URL(assets.shareImage, location.href).href);
  meta('meta[property="og:url"]', location.href.split('?')[0]);
  meta('meta[name="twitter:image"]', new URL(assets.shareImage, location.href).href);
  const dateCompact = event.date.replace(/[-:]/g, '').slice(0, 15);
  const endDate = new Date(new Date(event.date).getTime() + 4 * 3600000);
  const compact = (d) => `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}T${String(d.getHours()).padStart(2, '0')}${String(d.getMinutes()).padStart(2, '0')}00`;
  const endCompact = compact(endDate);
  const calendarTitle = `${texts.title} ${fullName}`;
  const locationText = `${event.venueName} — ${event.venueAddr}`;
  const googleUrl = new URL('https://calendar.google.com/calendar/render');
  googleUrl.search = new URLSearchParams({ action: 'TEMPLATE', text: calendarTitle, dates: `${dateCompact}/${endCompact}`, ctz: 'Asia/Baghdad', location: locationText, details: `رابط الدعوة: ${location.href.split('?')[0]}` }).toString();
  setHref('#googleCalendar', googleUrl.href);
  const apple = $('#appleCalendar');
  if (apple) apple.addEventListener('click', (e) => {
    e.preventDefault();
    const escape = (v) => String(v).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Wedding Invitation//AR', 'BEGIN:VEVENT', `UID:wedding-${dateCompact}@local`, `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}`, `DTSTART;TZID=Asia/Baghdad:${dateCompact}`, `DTEND;TZID=Asia/Baghdad:${endCompact}`, `SUMMARY:${escape(calendarTitle)}`, `LOCATION:${escape(locationText)}`, `DESCRIPTION:${escape(location.href.split('?')[0])}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const objectUrl = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
    const link = document.createElement('a'); link.href = objectUrl; link.download = 'wedding.ics'; link.click();
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  });
  const form = $('#da3wa-rsvp-form');
  if (form) {
    let attendance = 'نعم'; let companions = 0;
    form.querySelectorAll('.pill').forEach((button) => button.addEventListener('click', () => {
      attendance = button.textContent.trim();
      form.querySelectorAll('.pill').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    }));
    $('#da3wa-minus')?.addEventListener('click', () => { companions = Math.max(0, companions - 1); setText('#da3wa-guests', companions); });
    $('#da3wa-plus')?.addEventListener('click', () => { companions = Math.min(49, companions + 1); setText('#da3wa-guests', companions); });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const phone = String(event.contactPhone || '').replace(/\D/g, '');
      const error = $('#da3wa-err');
      if (!phone) { if (error) error.textContent = 'رقم التواصل غير متاح حاليًا'; return; }
      const name = form.elements.guest_name.value.trim();
      const wish = form.elements.message.value.trim();
      const message = [`تأكيد حضور: ${calendarTitle}`, `الاسم: ${name}`, `الحضور: ${attendance}`, `عدد المرافقين: ${attendance === 'نعم' ? companions : 0}`, wish ? `التهنئة: ${wish}` : ''].filter(Boolean).join('\n');
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
      const link = document.createElement('a');
      link.href = url; link.target = '_blank'; link.rel = 'noopener'; link.click();
    });
  }
})();
