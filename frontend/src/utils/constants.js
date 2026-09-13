export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
];

export const CATEGORIES = [
  { value: 'SC', labelKey: 'cat_sc' },
  { value: 'ST', labelKey: 'cat_st' },
  { value: 'OBC', labelKey: 'cat_obc' },
  { value: 'EWS', labelKey: 'cat_ews' },
  { value: 'General', labelKey: 'cat_general' },
];

export const GENDERS = [
  { value: 'male', labelKey: 'gender_male' },
  { value: 'female', labelKey: 'gender_female' },
  { value: 'other', labelKey: 'gender_other' },
];

export const BUSINESS_STAGES = [
  { value: 'idea', labelKey: 'stage_idea', icon: '💡' },
  { value: 'startup_less_1yr', labelKey: 'stage_startup', icon: '🚀' },
  { value: 'early_1_3yr', labelKey: 'stage_early', icon: '📈' },
  { value: 'established', labelKey: 'stage_established', icon: '🏢' },
];

export const SECTORS = [
  { value: 'manufacturing', labelKey: 'sector_manufacturing', icon: '🏭' },
  { value: 'services', labelKey: 'sector_services', icon: '💼' },
  { value: 'trading', labelKey: 'sector_trading', icon: '🏪' },
  { value: 'agriculture', labelKey: 'sector_agriculture', icon: '🌾' },
  { value: 'artisan', labelKey: 'sector_artisan', icon: '🎨' },
  { value: 'other', labelKey: 'sector_other', icon: '📦' },
];

export const AREAS = [
  { value: 'rural', labelKey: 'area_rural', icon: '🌿' },
  { value: 'urban', labelKey: 'area_urban', icon: '🏙️' },
];

export const EDUCATION_LEVELS = [
  { value: 'none', label: 'No formal education' },
  { value: 'primary', label: 'Primary School' },
  { value: 'secondary', label: 'Secondary School (10th)' },
  { value: 'higher_secondary', label: 'Higher Secondary (12th)' },
  { value: 'graduate', label: 'Graduate' },
  { value: 'post_graduate', label: 'Post Graduate' },
];

export const TRACKER_STATUSES = [
  { value: 'saved', labelKey: 'tracker_status_saved', color: 'primary' },
  { value: 'applied', labelKey: 'tracker_status_applied', color: 'warning' },
  { value: 'pending', labelKey: 'tracker_status_pending', color: 'accent' },
  { value: 'approved', labelKey: 'tracker_status_approved', color: 'success' },
];

export const RULE_OPERATORS = [
  { value: 'eq', label: 'Equals (=)' },
  { value: 'neq', label: 'Not Equals (≠)' },
  { value: 'in', label: 'In List' },
  { value: 'notIn', label: 'Not In List' },
  { value: 'lte', label: 'Less Than or Equal (≤)' },
  { value: 'gte', label: 'Greater Than or Equal (≥)' },
  { value: 'lt', label: 'Less Than (<)' },
  { value: 'gt', label: 'Greater Than (>)' },
  { value: 'between', label: 'Between (range)' },
  { value: 'exists', label: 'Exists (boolean)' },
];

export const RULE_FIELDS = [
  { value: 'category', label: 'Social Category' },
  { value: 'gender', label: 'Gender' },
  { value: 'isPwD', label: 'Person with Disability' },
  { value: 'isTransgender', label: 'Transgender' },
  { value: 'age', label: 'Age' },
  { value: 'annualIncome', label: 'Annual Income' },
  { value: 'businessStage', label: 'Business Stage' },
  { value: 'sector', label: 'Business Sector' },
  { value: 'state', label: 'State' },
  { value: 'ruralOrUrban', label: 'Rural/Urban' },
];
