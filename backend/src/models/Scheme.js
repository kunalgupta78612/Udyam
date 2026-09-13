
import mongoose from 'mongoose';

/**
 * Sub-schema for individual eligibility rules evaluated by the deterministic rule engine
 */
const eligibilityRuleSchema = new mongoose.Schema(
  {
    field: {
      type: String,
      required: [true, 'Rule field name is required'],
      trim: true,
      enum: {
        values: [
          'category',
          'gender',
          'age',
          'annualIncome',
          'businessStage',
          'sector',
          'state',
          'ruralOrUrban',
          'isPwD',
          'isTransgender',
          'hasCollateral',
          'qualification'
        ],
        message: '{VALUE} is not a recognized eligibility field'
      }
    },
    operator: {
      type: String,
      required: [true, 'Rule operator is required'],
      enum: {
        values: [
          'eq',
          'neq',
          'in',
          'notIn',
          'lte',
          'gte',
          'lt',
          'gt',
          'between',
          'exists'
        ],
        message: '{VALUE} is not a recognized operator'
      }
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Rule comparison value is required']
    },
    ruleType: {
      type: String,
      enum: ['hard', 'soft'],
      default: 'hard'
    },
    label: {
      type: String,
      required: [true, 'Rule label in English is required'],
      trim: true
    },
    labelHi: {
      type: String,
      default: null,
      trim: true
    }
  },
  { _id: false }
);

/**
 * Sub-schema for scheme benefits and financial ceilings
 */
const benefitsSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, 'Benefit type is required'],
      enum: ['loan', 'subsidy', 'grant', 'training', 'composite', 'other'],
      default: 'composite'
    },
    amount: {
      type: Number,
      default: null,
      min: [0, 'Benefit amount cannot be negative']
    },
    ceiling: {
      type: Number,
      default: null,
      min: [0, 'Benefit ceiling cannot be negative']
    },
    subsidyPercent: {
      type: Number,
      default: null,
      min: [0, 'Subsidy percentage cannot be negative'],
      max: [100, 'Subsidy percentage cannot exceed 100']
    },
    description: {
      type: String,
      required: [true, 'Benefit description in English is required'],
      trim: true
    },
    descriptionHi: {
      type: String,
      default: null,
      trim: true
    }
  },
  { _id: false }
);

/**
 * Sub-schema for mandatory and optional documentation checklist
 */
const documentRequiredSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Document name is required'],
      trim: true
    },
    nameHi: {
      type: String,
      default: null,
      trim: true
    },
    mandatory: {
      type: Boolean,
      default: true
    }
  },
  { _id: false }
);

/**
 * Main Scheme Schema representing Government Schemes in MongoDB
 */
const schemeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Scheme name is required'],
      unique: true,
      trim: true,
      maxlength: [250, 'Scheme name cannot exceed 250 characters']
    },
    nameHi: {
      type: String,
      default: null,
      trim: true
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true
    },
    sponsoringBody: {
      type: String,
      required: [true, 'Sponsoring ministry/department is required'],
      trim: true
    },
    level: {
      type: String,
      required: [true, 'Scheme level is required'],
      enum: {
        values: ['central', 'state'],
        message: '{VALUE} must be central or state'
      },
      default: 'central'
    },
    state: {
      type: String,
      default: null,
      trim: true,
      validate: {
        validator: function (val) {
          // If level is state, state name must be provided
          return this.level !== 'state' || (typeof val === 'string' && val.trim().length > 0);
        },
        message: 'State name is required for state-level schemes'
      }
    },
    description: {
      type: String,
      required: [true, 'Scheme description is required'],
      trim: true
    },
    descriptionHi: {
      type: String,
      default: null,
      trim: true
    },
    eligibilityRules: {
      type: [eligibilityRuleSchema],
      default: []
    },
    benefits: {
      type: benefitsSchema,
      required: [true, 'Scheme benefits structure is required']
    },
    documentsRequired: {
      type: [documentRequiredSchema],
      default: []
    },
    applicationLink: {
      type: String,
      default: null,
      trim: true
    },
    sourceUrl: {
      type: String,
      required: [true, 'Official source URL is required'],
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    },
    version: {
      type: Number,
      default: 1,
      min: [1, 'Version must be at least 1']
    }
  },
  {
    timestamps: true
  }
);

// Indexes for query performance
schemeSchema.index({ isActive: 1, level: 1, state: 1 });
schemeSchema.index({ name: 'text', description: 'text', sponsoringBody: 'text' });

// Auto-generate URL-friendly slug if not explicitly passed
schemeSchema.pre('save', function () {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
  }
});

const Scheme = mongoose.model('Scheme', schemeSchema);

export default Scheme;
