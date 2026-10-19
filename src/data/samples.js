const NASTALIQ_FONT = '"Noto Nastaliq Urdu", "Urdu Typesetting", "Jameel Noori Nastaleeq", "Alvi Nastaleeq", serif'
const GEORGIA = 'Georgia, "Times New Roman", serif'
const ARIAL = 'Arial, "Segoe UI", Helvetica, sans-serif'

function text(id, x, y, width, text, style = {}) {
  return {
    id,
    type: 'text',
    x,
    y,
    width,
    text,
    style: {
      fontFamily: ARIAL,
      fontSize: 15,
      color: '#1c2740',
      bold: false,
      italic: false,
      align: 'left',
      lineHeight: 1.5,
      dir: 'ltr',
      ...style,
    },
  }
}

export const PAGE_WIDTH = 800
export const PAGE_HEIGHT = 1120

export const FONT_CHOICES = [
  { label: 'Arial', value: ARIAL },
  { label: 'Georgia', value: GEORGIA },
  { label: 'Times New Roman', value: '"Times New Roman", Times, serif' },
  { label: 'Courier New', value: '"Courier New", Courier, monospace' },
  { label: 'Verdana', value: 'Verdana, Geneva, sans-serif' },
  { label: 'Tahoma', value: 'Tahoma, Verdana, sans-serif' },
  { label: 'Urdu Nastaliq', value: NASTALIQ_FONT },
]

export const COLOR_PRESETS = ['#1c2740', '#4f46e5', '#0f766e', '#b91c1c', '#a16207', '#475569', '#7c3aed', '#000000']

function schoolNoticeDoc() {
  const created = '2026-10-12T09:20:00.000Z'
  return {
    id: 'sample_school_notice',
    name: 'School Weekly Notice — Grade 5',
    source: 'sample',
    createdAt: created,
    updatedAt: '2026-10-14T11:05:00.000Z',
    page: {
      width: PAGE_WIDTH,
      height: PAGE_HEIGHT,
      background: '#ffffff',
      backgroundImage: null,
      showBackground: true,
    },
    elements: [
      text('s1_h', 70, 64, 660, 'AL-NOOR PUBLIC SCHOOL & ACADEMY', {
        fontFamily: GEORGIA,
        fontSize: 26,
        bold: true,
        align: 'center',
        color: '#101a30',
      }),
      text('s1_sub', 70, 106, 660, 'Main Campus, Garden Road  ·  Session 2025–26  ·  Office of the Principal', {
        fontSize: 13,
        italic: true,
        align: 'center',
        color: '#556280',
      }),
      text('s1_line', 70, 140, 660, '──────────────────────────────', {
        fontSize: 12,
        align: 'center',
        color: '#9aa6bd',
      }),
      text('s1_title', 70, 176, 660, 'OFFICE NOTICE', {
        fontFamily: GEORGIA,
        fontSize: 22,
        bold: true,
        align: 'center',
        color: '#101a30',
      }),
      text('s1_ref', 70, 226, 660, 'Ref: ANPS/PTM/2026/41                                      Date: 14 October 2026', {
        fontSize: 13,
        color: '#33415c',
      }),
      text('s1_sal', 70, 278, 660, 'Dear Parents and Guardians,', { fontSize: 15 }),
      text('s1_p1', 70, 318, 660, 'This is to inform you that the Parent–Teacher Meeting for Grades 1 to 5 will be held on Saturday, 25 October 2026, from 9:00 AM to 1:00 PM in the school main hall.', {
        fontSize: 15,
        lineHeight: 1.65,
      }),
      text('s1_p2', 70, 408, 660, 'Parents are requested to bring the student progress report card and wear the visitor badge issued at the gate. Please observe the time slot shared by your child’s class teacher so that the meeting runs smoothly.', {
        fontSize: 15,
        lineHeight: 1.65,
      }),
      text('s1_p3', 70, 512, 660, 'Students arriving with parents will attend regular classes on that day. The school canteen will remain closed; drinking water facilities are available on every floor.', {
        fontSize: 15,
        lineHeight: 1.65,
      }),
      text('s1_p4', 70, 594, 660, 'Your cooperation in ensuring a punctual and orderly meeting will be appreciated.', {
        fontSize: 15,
        lineHeight: 1.65,
      }),
      text('s1_ur', 70, 668, 660, 'مزید معلومات کے لیے اسکول دفتر سے رابطہ کریں۔', {
        fontFamily: NASTALIQ_FONT,
        fontSize: 17,
        align: 'center',
        dir: 'rtl',
        color: '#1c2740',
      }),
      text('s1_sig', 430, 780, 300, 'Principal', { bold: true, align: 'right', fontSize: 15 }),
      text('s1_sig2', 430, 810, 300, '( Mrs. Ayesha Rahman )', { align: 'right', fontSize: 14, color: '#33415c' }),
      text('s1_foot', 70, 1020, 660, 'Demo content for the Logrithoo prototype — this text was not produced by OCR.', {
        fontSize: 11,
        italic: true,
        align: 'center',
        color: '#8792ab',
      }),
    ],
  }
}

function urduNoticeDoc() {
  const created = '2026-10-10T08:00:00.000Z'
  return {
    id: 'sample_urdu_notice',
    name: 'Urdu Exam Notice — اردو اطلاع',
    source: 'sample',
    createdAt: created,
    updatedAt: '2026-10-13T15:40:00.000Z',
    page: {
      width: PAGE_WIDTH,
      height: PAGE_HEIGHT,
      background: '#ffffff',
      backgroundImage: null,
      showBackground: true,
    },
    elements: [
      text('s2_h', 70, 90, 660, 'اطلاع', {
        fontFamily: NASTALIQ_FONT,
        fontSize: 30,
        bold: true,
        align: 'center',
        dir: 'rtl',
      }),
      text('s2_school', 70, 156, 660, 'جامعة الرشد اسکول، حیدرآباد', {
        fontFamily: NASTALIQ_FONT,
        fontSize: 18,
        align: 'center',
        dir: 'rtl',
        color: '#475569',
      }),
      text('s2_p1', 90, 240, 620, 'تمام طلبہ و طالبات کو اطلاع دی جاتی ہے کہ سالانہ امتحانات 25 اکتوبر 2026 سے شروع ہوں گے۔', {
        fontFamily: NASTALIQ_FONT,
        fontSize: 17,
        dir: 'rtl',
        align: 'right',
        lineHeight: 2,
      }),
      text('s2_p2', 90, 360, 620, 'امتحانی جدول اسکول نوٹس بورڈ پر لگا دی گئی ہے۔ طلبہ کے لیے حاضری ضروری ہے۔', {
        fontFamily: NASTALIQ_FONT,
        fontSize: 17,
        dir: 'rtl',
        align: 'right',
        lineHeight: 2,
      }),
      text('s2_sign', 90, 490, 620, 'مدیر ادارہ', {
        fontFamily: NASTALIQ_FONT,
        fontSize: 16,
        bold: true,
        dir: 'rtl',
        align: 'left',
      }),
      text('s2_en', 70, 600, 660, 'English summary: Annual examinations begin on 25 October 2026. The date sheet is on the notice board. Attendance is mandatory.', {
        fontSize: 12,
        italic: true,
        color: '#64748b',
        lineHeight: 1.6,
      }),
      text('s2_foot', 70, 1020, 660, 'Prototype sample — Urdu layout uses a Nastaliq system font fallback.', {
        fontSize: 11,
        italic: true,
        align: 'center',
        color: '#8792ab',
      }),
    ],
  }
}

function memoDoc() {
  const created = '2026-10-08T13:10:00.000Z'
  return {
    id: 'sample_memo',
    name: 'Inter-Office Memorandum',
    source: 'sample',
    createdAt: created,
    updatedAt: '2026-10-11T10:25:00.000Z',
    page: {
      width: PAGE_WIDTH,
      height: PAGE_HEIGHT,
      background: '#ffffff',
      backgroundImage: null,
      showBackground: true,
    },
    elements: [
      text('s3_h', 70, 76, 660, 'INTER-OFFICE MEMORANDUM', {
        fontFamily: GEORGIA,
        fontSize: 21,
        bold: true,
        align: 'center',
      }),
      text('s3_line', 70, 112, 660, '──────────────────────────────', {
        fontSize: 12,
        align: 'center',
        color: '#9aa6bd',
      }),
      text('s3_to', 70, 154, 660, 'To:            All Department Heads', { fontSize: 14 }),
      text('s3_from', 70, 184, 660, 'From:      Office of the Academic Director', { fontSize: 14 }),
      text('s3_sub', 70, 214, 660, 'Subject:   Preparation of the Annual Examination Schedule', {
        fontSize: 14,
        bold: true,
      }),
      text('s3_date', 70, 244, 660, 'Date:       12 October 2026', { fontSize: 14 }),
      text('s3_p1', 70, 300, 660, 'Department heads are requested to submit their course completion reports and proposed examination dates to the Academic Office no later than 20 October 2026.', {
        fontSize: 15,
        lineHeight: 1.65,
      }),
      text('s3_p2', 70, 384, 660, 'Please ensure that question paper drafts follow the shared moderation template. Late submissions may delay the final date sheet, which is scheduled for release on 28 October 2026.', {
        fontSize: 15,
        lineHeight: 1.65,
      }),
      text('s3_p3', 70, 480, 660, 'Kindly acknowledge receipt of this memorandum by email to the Academic Office.', {
        fontSize: 15,
        lineHeight: 1.65,
      }),
      text('s3_sig', 430, 600, 300, 'Academic Director', { bold: true, align: 'right', fontSize: 15 }),
      text('s3_sig2', 430, 630, 300, '( Dr. Imran Qureshi )', { align: 'right', fontSize: 14, color: '#33415c' }),
      text('s3_foot', 70, 1020, 660, 'Sample document bundled with the Logrithoo prototype.', {
        fontSize: 11,
        italic: true,
        align: 'center',
        color: '#8792ab',
      }),
    ],
  }
}

export function createSampleDocuments() {
  return [schoolNoticeDoc(), urduNoticeDoc(), memoDoc()]
}

export function createBlankElements() {
  return [
    text(`el_${Math.random().toString(36).slice(2, 8)}`, 90, 90, 620, 'New text block — double-click to edit.', {
      fontSize: 18,
      bold: true,
    }),
  ]
}

export function createDocumentFromImage({ name, dataUrl, width, height }) {
  const now = new Date().toISOString()
  return {
    id: `doc_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
    name,
    source: 'user',
    createdAt: now,
    updatedAt: now,
    page: {
      width: PAGE_WIDTH,
      height: PAGE_HEIGHT,
      background: '#ffffff',
      backgroundImage: dataUrl,
      imageWidth: width,
      imageHeight: height,
      showBackground: true,
    },
    elements: createBlankElements(),
  }
}
