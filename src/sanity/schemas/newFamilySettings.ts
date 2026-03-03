import { defineField, defineType } from 'sanity'

export const newFamilySettings = defineType({
  name: 'newFamilySettings',
  title: '새가족 설정',
  type: 'document',
  fields: [
    defineField({
      name: 'displayMonths',
      title: '새가족 표시 기간 (개월)',
      type: 'number',
      description: '등록일 기준으로 몇 개월간 새가족을 표시할지 설정합니다. 예: 3 → 최근 3개월. 비워두면 전체 표시.',
      validation: (rule) => rule.min(1).max(24),
    }),
    defineField({
      name: 'welcomeMessage',
      title: '환영 인사말',
      type: 'portableText',
      description: '새가족 페이지 상단에 표시되는 환영 인사말입니다.',
    }),
    defineField({
      name: 'registrationSteps',
      title: '등록 절차',
      type: 'array',
      description: '새가족 등록 절차를 단계별로 안내합니다.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'stepNumber',
              title: '단계 번호',
              type: 'number',
              validation: (rule) => rule.required().min(1),
            }),
            defineField({
              name: 'title',
              title: '제목',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'description',
              title: '설명',
              type: 'string',
            }),
          ],
          preview: {
            select: {
              stepNumber: 'stepNumber',
              title: 'title',
            },
            prepare({ stepNumber, title }) {
              return {
                title: `${stepNumber}. ${title}`,
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'extraFieldLabels',
      title: '추가 정보 항목',
      type: 'array',
      description: '새가족 등록 시 수집할 추가 정보 항목을 정의합니다. 여기서 정의한 항목명이 새가족 문서의 추가 정보에 표시됩니다. (예: 소속 구역, 출신교회, 연락처)',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'assignedStaff',
      title: '담당 교역자',
      type: 'array',
      description: '"관리 > 사역자"에서 먼저 등록한 후 여기서 선택하세요.',
      options: { sortable: false },
      of: [
        {
          type: 'reference',
          to: [{ type: 'staff' }],
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: '새가족 설정' }
    },
  },
})
