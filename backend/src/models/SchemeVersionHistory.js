import mongoose from 'mongoose';

/**
 * SchemeVersionHistory Schema for auditable change logs and version snapshots
 */
const schemeVersionHistorySchema = new mongoose.Schema(
  {
    scheme: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Scheme',
      required: [true, 'Scheme reference is required'],
      index: true
    },
    version: {
      type: Number,
      required: [true, 'Version number is required']
    },
    snapshot: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Scheme snapshot object is required']
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Admin user reference is required']
    },
    changeReason: {
      type: String,
      default: 'Scheme updated by admin',
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// Compound index on scheme and version
schemeVersionHistorySchema.index({ scheme: 1, version: 1 });

const SchemeVersionHistory = mongoose.model(
  'SchemeVersionHistory',
  schemeVersionHistorySchema
);

export default SchemeVersionHistory;
