import mongoose from 'mongoose';

/**
 * SavedScheme Schema for user scheme bookmarking and application tracking
 */
const savedSchemeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true
    },
    scheme: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Scheme',
      required: [true, 'Scheme reference is required'],
      index: true
    },
    status: {
      type: String,
      enum: {
        values: ['Saved', 'Applied', 'Approved', 'Pending'],
        message: '{VALUE} is not a valid status. Allowed: Saved, Applied, Approved, Pending'
      },
      default: 'Saved'
    },
    notes: {
      type: String,
      default: '',
      trim: true
    },
    appliedAt: {
      type: Date,
      default: null
    },
    updatedStatusAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Prevent duplicate saves of the same scheme by the same user
savedSchemeSchema.index({ user: 1, scheme: 1 }, { unique: true });

const SavedScheme = mongoose.model('SavedScheme', savedSchemeSchema);

export default SavedScheme;
