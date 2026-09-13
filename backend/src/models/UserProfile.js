import mongoose from 'mongoose';

const userProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    category: {
      type: String,
      required: [true, 'Please select a social category'],
      enum: {
        values: ['SC', 'ST', 'OBC', 'EWS', 'General'],
        message: '{VALUE} is not a valid category'
      }
    },
    gender: {
      type: String,
      required: [true, 'Please select gender'],
      enum: {
        values: ['male', 'female', 'other'],
        message: '{VALUE} is not a valid gender'
      }
    },
    age: {
      type: Number,
      required: [true, 'Please provide your age'],
      min: [14, 'Age must be at least 14'],
      max: [100, 'Age must be under 100']
    },
    annualIncome: {
      type: Number,
      required: [true, 'Please provide annual family income'],
      min: [0, 'Annual income cannot be negative']
    },
    businessStage: {
      type: String,
      required: [true, 'Please select your business stage'],
      enum: {
        values: ['idea', 'startup_less_1yr', 'early_1_3yr', 'established'],
        message: '{VALUE} is not a valid business stage'
      }
    },
    sector: {
      type: String,
      required: [true, 'Please select your industry sector'],
      enum: {
        values: ['manufacturing', 'services', 'trading', 'agriculture', 'artisan', 'other'],
        message: '{VALUE} is not a valid sector'
      }
    },
    state: {
      type: String,
      required: [true, 'Please select your state/UT'],
      trim: true
    },
    ruralOrUrban: {
      type: String,
      required: [true, 'Please specify rural or urban location'],
      enum: {
        values: ['rural', 'urban'],
        message: '{VALUE} must be either rural or urban'
      }
    },
    isPwD: {
      type: Boolean,
      default: false
    },
    isTransgender: {
      type: Boolean,
      default: false
    },
    hasCollateral: {
      type: Boolean,
      default: false
    },
    qualification: {
      type: String,
      default: null,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

const UserProfile = mongoose.model('UserProfile', userProfileSchema);

export default UserProfile;
