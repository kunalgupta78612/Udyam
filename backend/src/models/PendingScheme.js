import mongoose from 'mongoose';

/**
 * PendingScheme Schema for AI-parsed schemes awaiting human-in-the-loop admin review
 */
const pendingSchemeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Scheme name is required'],
      trim: true,
      maxlength: [250, 'Scheme name cannot exceed 250 characters']
    },
    nameHi: {
      type: String,
      default: null,
      trim: true
    },
    sponsoringBody: {
      type: String,
      required: [true, 'Sponsoring body is required'],
      trim: true
    },
    level: {
      type: String,
      required: [true, 'Level is required'],
      enum: ['central', 'state'],
      default: 'central'
    },
    state: {
      type: String,
      default: null,
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true
    },
    descriptionHi: {
      type: String,
      default: null,
      trim: true
    },
    eligibilityRules: {
      type: Array,
      default: []
    },
    benefits: {
      type: Object,
      required: [true, 'Benefits definition is required']
    },
    documentsRequired: {
      type: Array,
      default: []
    },
    applicationLink: {
      type: String,
      default: null,
      trim: true
    },
    sourceUrl: {
      type: String,
      required: [true, 'Source URL is required'],
      trim: true
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true
    },
    rawScrapedContent: {
      type: Object,
      default: null
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    reviewedAt: {
      type: Date,
      default: null
    },
    reviewNotes: {
      type: String,
      default: '',
      trim: true
    },
    approvedScheme: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Scheme',
      default: null
    }
  },
  {
    timestamps: true
  }
);

const PendingScheme = mongoose.model('PendingScheme', pendingSchemeSchema);

export default PendingScheme;
