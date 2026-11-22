// shortcut: 백엔드 enum 미확정에 따른 임시 코드, API 명세 확정 후 Orval 타입으로 교체
export const GENDER_OPTIONS = [
  { value: "MALE", label: "남자" },
  { value: "FEMALE", label: "여자" },
] as const;

export const FIELD_OPTIONS = [
  { value: "BUSINESS", label: "경영·사업기획" },
  { value: "MARKETING", label: "마케팅·광고·홍보" },
  { value: "DESIGN", label: "디자인" },
  { value: "SOFTWARE", label: "IT·소프트웨어 개발" },
  { value: "DATA_AI", label: "데이터 분석·AI" },
  { value: "HUMANITIES_SOCIAL", label: "인문·사회·심리학" },
  { value: "LAW", label: "법률·법학" },
  { value: "EDUCATION", label: "교육·교육학" },
  { value: "ENGINEERING_SCIENCE", label: "공학·자연과학" },
  { value: "MEDICINE_HEALTH", label: "의약·보건" },
  { value: "ARTS_SPORTS", label: "예술·체육" },
  { value: "ETC", label: "기타(직접 입력)" },
] as const;

export const REGION_OPTIONS = [
  { value: "SEOUL", label: "서울" },
  { value: "BUSAN", label: "부산" },
  { value: "DAEGU", label: "대구" },
  { value: "INCHEON", label: "인천" },
  { value: "GWANGJU", label: "광주" },
  { value: "DAEJEON", label: "대전" },
  { value: "ULSAN", label: "울산" },
  { value: "SEJONG", label: "세종" },
  { value: "GYEONGGI", label: "경기" },
  { value: "GANGWON", label: "강원" },
  { value: "CHUNGBUK", label: "충북" },
  { value: "CHUNGNAM", label: "충남" },
  { value: "JEONBUK", label: "전북" },
  { value: "JEONNAM", label: "전남" },
  { value: "GYEONGBUK", label: "경북" },
  { value: "GYEONGNAM", label: "경남" },
  { value: "JEJU", label: "제주" },
  { value: "OVERSEAS", label: "해외" },
] as const;

export const HOUSEHOLD_OPTIONS = [
  { value: "ALONE", label: "1인 가구(자취)" },
  { value: "PARENTS", label: "부모님과 거주" },
  { value: "SPOUSE", label: "배우자와 거주(자녀 없음)" },
  { value: "SPOUSE_CHILDREN", label: "배우자와 자녀와 거주" },
  { value: "CHILDREN", label: "자녀와 거주(배우자 없음)" },
  { value: "SIBLINGS", label: "형제·자매와 거주" },
  { value: "RELATIVES", label: "조부모·친척과 거주" },
  { value: "ROOMMATES", label: "친구·지인·룸메이트와 거주" },
  { value: "ETC", label: "기타(직접 입력)" },
] as const;

export const HOUSEHOLD_SIZE_OPTIONS = [
  { value: "ONE", label: "1명" },
  { value: "TWO", label: "2명" },
  { value: "THREE", label: "3명" },
  { value: "FOUR", label: "4명" },
  { value: "FIVE_OR_MORE", label: "5명 이상" },
] as const;

export const MARITAL_STATUS_OPTIONS = [
  { value: "SINGLE", label: "미혼" },
  { value: "MARRIED", label: "기혼" },
  { value: "DIVORCED", label: "이혼" },
  { value: "ETC", label: "기타(직접 입력)" },
] as const;

export const CHILDREN_OPTIONS = [
  { value: "NONE", label: "없음" },
  { value: "ONE", label: "1명" },
  { value: "TWO", label: "2명" },
  { value: "THREE", label: "3명" },
  { value: "FOUR_OR_MORE", label: "4명 이상" },
] as const;

export const PET_EXPERIENCE_OPTIONS = [
  { value: "NEVER", label: "키운 적 없음" },
  { value: "PAST", label: "과거에 키움" },
  { value: "CURRENT", label: "현재 키우고 있음" },
] as const;

export const PET_TYPE_OPTIONS = [
  { value: "DOG", label: "강아지" },
  { value: "CAT", label: "고양이" },
  { value: "OTHER_MAMMAL", label: "기타 포유류" },
  { value: "BIRD", label: "조류" },
  { value: "AMPHIBIAN", label: "양서류" },
  { value: "REPTILE", label: "파충류" },
  { value: "INSECT", label: "곤충류" },
  { value: "PLANT", label: "식물" },
  { value: "ETC", label: "기타" },
] as const;

export const DRIVING_LICENSE_OPTIONS = [
  { value: "NONE", label: "없음" },
  { value: "CLASS_ONE", label: "제1종 면허 보유" },
  { value: "CLASS_TWO", label: "제2종 면허 보유" },
] as const;

export const OCCUPATION_OPTIONS = [
  { value: "SCHOOL_STUDENT", label: "중/고등학생" },
  { value: "UNIVERSITY_STUDENT", label: "대학생" },
  { value: "GRADUATE_STUDENT", label: "대학원생" },
  { value: "EMPLOYED", label: "직장인" },
  { value: "SELF_EMPLOYED", label: "자영업/개인사업자(법인 제외)" },
  { value: "FREELANCER", label: "프리랜서" },
  { value: "JOB_SEEKER", label: "취업준비생" },
  { value: "HOMEMAKER", label: "주부" },
  { value: "MILITARY", label: "군인" },
  { value: "UNEMPLOYED_OR_ON_LEAVE", label: "무직·휴직" },
  { value: "ETC", label: "기타(직접 입력)" },
] as const;
