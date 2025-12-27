export interface Subject {
  id: string
  name: string
  type: 'lecture' | 'practical' | 'lab'
  instructor: string
  room: string
  week: 'numerator' | 'denominator' | 'both'
  timeStart: string
  timeEnd: string
}

export interface DaySchedule {
  day: string
  subjects: Subject[]
}

export interface Group {
  id: string
  number: string
  facultyId: string
  courseId: string
  field: string
  profile: string
  schedule: {
    numerator: DaySchedule[]
    denominator: DaySchedule[]
  }
}

export interface Course {
  id: string
  number: number
  facultyId: string
  groups: string[]
}

export interface Faculty {
  id: string
  name: string
  courses: string[]
}

export const faculties: Faculty[] = [
  {
    id: '1',
    name: 'Институт естественных наук',
    courses: ['1-1', '1-2', '1-3', '1-4'], // Все курсы института 1
  },
]

export const courses: Course[] = [
  {
    id: '1-1',
    number: 1,
    facultyId: '1',
    groups: [],
  },
  {
    id: '1-2',
    number: 2,
    facultyId: '1',
    groups: [],
  },
  {
    id: '1-3',
    number: 3,
    facultyId: '1',
    groups: ['5306'],
  },
  {
    id: '1-4',
    number: 4,
    facultyId: '1',
    groups: [],
  },
]

// Функция для удаления префиксов из ФИО преподавателя
const cleanInstructor = (instructor: string): string => {
  if (!instructor) return ''
  // Обрабатываем случаи с несколькими преподавателями (через запятую)
  return instructor
    .split(',')
    .map((inst) => {
      return inst
        .replace(/^(Ст\.\s*Пр\.|Доц\.|Проф\.|Асс\.|Ст\.\s*Преп\.)\s*/gi, '')
        .trim()
    })
    .join(', ')
}

// Функция для получения времени пары по её номеру (1-5)
const getPairTime = (pairNumber: number): { start: string; end: string } => {
  const times = [
    { start: '7:45', end: '9:15' },   // 1 пара
    { start: '9:25', end: '10:55' },  // 2 пара
    { start: '11:25', end: '12:45' }, // 3 пара
    { start: '12:55', end: '14:25' }, // 4 пара
    { start: '14:35', end: '16:05' }, // 5 пара (14:35 + 1.5 часа)
  ]
  return times[pairNumber - 1] || { start: '', end: '' }
}

// Функция для добавления времени к предметам в дне
const addTimesToDay = (daySchedule: DaySchedule): DaySchedule => {
  return {
    ...daySchedule,
    subjects: daySchedule.subjects.map((subject, index) => {
      const pairNumber = index + 1
      const time = getPairTime(pairNumber)
      return {
        ...subject,
        timeStart: time.start,
        timeEnd: time.end,
      }
    }),
  }
}

// Функция для создания дня самостоятельной работы
const createSelfStudyDay = (day: string): DaySchedule => {
  return {
    day: day,
    subjects: [],
  }
}

// Функция для создания пустой пары (нет пары)
const createEmptyPair = (pairNumber: number, week: 'numerator' | 'denominator' = 'numerator'): Subject => {
  const time = getPairTime(pairNumber)
  return {
    id: `empty-${pairNumber}-${week}`,
    name: 'Нет пары',
    type: 'lecture',
    instructor: '',
    room: '',
    week: week,
    timeStart: time.start,
    timeEnd: time.end,
  }
}

export const groups: Group[] = [
  {
    id: '5306',
    number: '5306',
    facultyId: '1',
    courseId: '1-3',
    field: '43.03.02 Туризм',
    profile: 'Технология и организация туроператорских и турагентских услуг',
    schedule: {
      numerator: [
        createSelfStudyDay('Понедельник'),
        addTimesToDay({
          day: 'Вторник',
          subjects: [
            {
              id: '1',
              name: 'Музееведение',
              type: 'practical',
              instructor: cleanInstructor('Ст. Пр. Беркасова Лариса Васильевна'),
              room: '86а',
              week: 'numerator',
              timeStart: '',
              timeEnd: '',
            },
            {
              id: '2',
              name: 'Иностранный язык в делового общения (второй)',
              type: 'practical',
              instructor: cleanInstructor('Ст. Пр. Туласов И.Н.'),
              room: '19',
              week: 'numerator',
              timeStart: '',
              timeEnd: '',
            },
            {
              id: '3',
              name: 'Демографические основы туристической деятельности',
              type: 'lecture',
              instructor: cleanInstructor('Ст. Пр. Беркасова Л.В.'),
              room: '86а',
              week: 'numerator',
              timeStart: '',
              timeEnd: '',
            },
            {
              id: '4',
              name: 'Основы проектной деятельности и командной работы',
              type: 'lecture',
              instructor: cleanInstructor('Ст. Пр. Корсукова Ольга Валерьевна'),
              room: '96',
              week: 'numerator',
              timeStart: '',
              timeEnd: '',
            },
          ],
        }),
        addTimesToDay({
          day: 'Среда',
          subjects: [
            createEmptyPair(1),
            {
              id: '5',
              name: 'Межкультурные коммуникации на иностранном языке',
              type: 'practical',
              instructor: cleanInstructor('Ст. Пр. Ковтун Н.В.'),
              room: '19',
              week: 'numerator',
              timeStart: '',
              timeEnd: '',
            },
            {
              id: '6',
              name: 'Межкультурные коммуникации на иностранном языке',
              type: 'practical',
              instructor: cleanInstructor('Ст. Пр. Ковтун Н.В.'),
              room: '19',
              week: 'numerator',
              timeStart: '',
              timeEnd: '',
            },
            {
              id: '7',
              name: 'Маркетинговые исследования в туризме',
              type: 'lab',
              instructor: cleanInstructor('Доц. Шилина О.А.'),
              room: '86а',
              week: 'numerator',
              timeStart: '',
              timeEnd: '',
            },
          ],
        }),
        addTimesToDay({
          day: 'Четверг',
          subjects: [
            {
              id: '8',
              name: 'Музееведение',
              type: 'practical',
              instructor: cleanInstructor('Ст. Преп. Беркасова Л.В.'),
              room: '94',
              week: 'numerator',
              timeStart: '',
              timeEnd: '',
            },
            {
              id: '9',
              name: 'Геополитические условия развития международного туризма',
              type: 'practical',
              instructor: cleanInstructor('Ст. Пр. Беркасова Л.В.'),
              room: '86а',
              week: 'numerator',
              timeStart: '',
              timeEnd: '',
            },
            {
              id: '10',
              name: 'Маркетинговые исследования в туризме',
              type: 'lab',
              instructor: cleanInstructor('Доц. Шилина О.А.'),
              room: '94',
              week: 'numerator',
              timeStart: '',
              timeEnd: '',
            },
            {
              id: '11',
              name: 'Музееведение',
              type: 'practical',
              instructor: cleanInstructor('Ст. Преп. Беркасова Л.В.'),
              room: '94',
              week: 'numerator',
              timeStart: '',
              timeEnd: '',
            },
          ],
        }),
        addTimesToDay({
          day: 'Пятница',
          subjects: [
            {
              id: '12',
              name: 'Реклама в туризме',
              type: 'lecture',
              instructor: cleanInstructor('Ст. Пр. Мельникова Виктория Константиновна'),
              room: '94',
              week: 'numerator',
              timeStart: '',
              timeEnd: '',
            },
            {
              id: '13',
              name: 'Геополитические условия развития международного туризма',
              type: 'practical',
              instructor: cleanInstructor('Ст. Преп. Беркасова Л.В.'),
              room: '94',
              week: 'numerator',
              timeStart: '',
              timeEnd: '',
            },
            {
              id: '14',
              name: 'Физкультура',
              type: 'practical',
              instructor: '',
              room: '',
              week: 'numerator',
              timeStart: '',
              timeEnd: '',
            },
            createEmptyPair(4),
          ],
        }),
        createSelfStudyDay('Суббота'),
      ],
      denominator: [
        createSelfStudyDay('Понедельник'),
        addTimesToDay({
          day: 'Вторник',
          subjects: [
            createEmptyPair(1, 'denominator'),
            {
              id: 'd-1',
              name: 'Иностранный язык делового общения',
              type: 'practical',
              instructor: cleanInstructor('Ст. Пр. Туласов И.Н.'),
              room: '19',
              week: 'denominator',
              timeStart: '',
              timeEnd: '',
            },
            {
              id: 'd-2',
              name: 'Маркетинговые исследования в туризме',
              type: 'lab',
              instructor: cleanInstructor('Доц. Шилина О.А.'),
              room: '86а',
              week: 'denominator',
              timeStart: '',
              timeEnd: '',
            },
            {
              id: 'd-3',
              name: 'Основы проектной деятельности и командной работы',
              type: 'lecture',
              instructor: cleanInstructor('Ст. Пр. Корсукова Ольга Валерьевна'),
              room: '96',
              week: 'denominator',
              timeStart: '',
              timeEnd: '',
            },
          ],
        }),
        addTimesToDay({
          day: 'Среда',
          subjects: [
            {
              id: 'd-4',
              name: 'Управление качеством услуг в туризме',
              type: 'practical',
              instructor: cleanInstructor('Доц. Кулакова Н.И.'),
              room: '86а',
              week: 'denominator',
              timeStart: '',
              timeEnd: '',
            },
            {
              id: 'd-5',
              name: 'Межкультурные коммуникации на иностранном языке',
              type: 'practical',
              instructor: cleanInstructor('Ст. Пр. Ковтун Н.В.'),
              room: '19',
              week: 'denominator',
              timeStart: '',
              timeEnd: '',
            },
            {
              id: 'd-6',
              name: 'Управление качеством услуг в туризме',
              type: 'practical',
              instructor: cleanInstructor('Доц. Кулакова Н.И.'),
              room: '86а',
              week: 'denominator',
              timeStart: '',
              timeEnd: '',
            },
            {
              id: 'd-7',
              name: 'Демографические основы туристической деятельности',
              type: 'lecture',
              instructor: cleanInstructor('Ст. Пр. Беркасова Л.В.'),
              room: '86а',
              week: 'denominator',
              timeStart: '',
              timeEnd: '',
            },
          ],
        }),
        addTimesToDay({
          day: 'Четверг',
          subjects: [
            createEmptyPair(1, 'denominator'),
            createEmptyPair(2, 'denominator'),
            {
              id: 'd-8',
              name: 'Демографические основы туристической деятельности',
              type: 'lecture',
              instructor: cleanInstructor('Ст. Пр. Беркасова Л.В.'),
              room: '86а',
              week: 'denominator',
              timeStart: '',
              timeEnd: '',
            },
            {
              id: 'd-9',
              name: 'Управление качеством услуг в туризме',
              type: 'practical',
              instructor: cleanInstructor('Доц. Кулакова Н.И.'),
              room: '94',
              week: 'denominator',
              timeStart: '',
              timeEnd: '',
            },
          ],
        }),
        addTimesToDay({
          day: 'Пятница',
          subjects: [
            {
              id: 'd-10',
              name: 'Реклама в туризме',
              type: 'lecture',
              instructor: cleanInstructor('Ст. Пр. Мельникова Виктория Константиновна'),
              room: '94',
              week: 'denominator',
              timeStart: '',
              timeEnd: '',
            },
            {
              id: 'd-11',
              name: 'Геополитические условия развития международного туризма',
              type: 'practical',
              instructor: cleanInstructor('Ст. Преп. Беркасова Л.В.'),
              room: '94',
              week: 'denominator',
              timeStart: '',
              timeEnd: '',
            },
          ],
        }),
        createSelfStudyDay('Суббота'),
      ],
    },
  },
]

export const getGroupById = (id: string): Group | undefined => {
  return groups.find((group) => group.id === id)
}

export const getFacultyById = (id: string): Faculty | undefined => {
  return faculties.find((faculty) => id === faculty.id)
}

export const getCourseById = (id: string): Course | undefined => {
  return courses.find((course) => course.id === id)
}

export const getCoursesByFacultyId = (facultyId: string): Course[] => {
  return courses.filter((course) => course.facultyId === facultyId)
}

export const getGroupsByCourseId = (courseId: string): Group[] => {
  return groups.filter((group) => group.courseId === courseId)
}

// Функция для получения предмета по ID
export const getSubjectById = (
  groupId: string,
  week: 'numerator' | 'denominator',
  day: string,
  subjectId: string
): Subject | undefined => {
  const group = groups.find((g) => g.id === groupId)
  if (!group) return undefined

  const daySchedule = group.schedule[week].find((d) => d.day === day)
  if (!daySchedule) return undefined

  return daySchedule.subjects.find((s) => s.id === subjectId)
}

// Функция для обновления предмета в расписании
export const updateSubject = (
  groupId: string,
  week: 'numerator' | 'denominator',
  day: string,
  subjectId: string,
  updatedSubject: Subject
): void => {
  const group = groups.find((g) => g.id === groupId)
  if (!group) return

  const daySchedule = group.schedule[week].find((d) => d.day === day)
  if (!daySchedule) return

  const subjectIndex = daySchedule.subjects.findIndex((s) => s.id === subjectId)
  if (subjectIndex === -1) return

  daySchedule.subjects[subjectIndex] = updatedSubject
}

// Функция для удаления предмета из расписания (заменяет на "Нет пары")
export const deleteSubject = (
  groupId: string,
  week: 'numerator' | 'denominator',
  day: string,
  subjectId: string
): void => {
  const group = groups.find((g) => g.id === groupId)
  if (!group) return

  const daySchedule = group.schedule[week].find((d) => d.day === day)
  if (!daySchedule) return

  const subjectIndex = daySchedule.subjects.findIndex((s) => s.id === subjectId)
  if (subjectIndex === -1) return

  // Получаем номер пары по индексу (начинается с 1)
  const pairNumber = subjectIndex + 1
  const time = getPairTime(pairNumber)
  
  // Заменяем предмет на "Нет пары" вместо удаления
  daySchedule.subjects[subjectIndex] = {
    id: `empty-${pairNumber}-${week}-${Date.now()}`,
    name: 'Нет пары',
    type: 'lecture',
    instructor: '',
    room: '',
    week: week,
    timeStart: time.start,
    timeEnd: time.end,
  }
}
