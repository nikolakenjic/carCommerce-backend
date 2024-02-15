import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const CarSchema = new Schema(
  {
    make: {
      type: String,
      required: [true, 'Please enter car name'],
    },
    model: {
      type: String,
      required: [true, 'Please enter car model'],
    },
    year: {
      type: Number,
      required: [true, 'Please enter car year'],
    },
    mileage: {
      type: Number,
      required: [true, 'Please enter car mileage'],
    },
    fuelType: {
      type: String,
      required: [true, 'Please enter fuel type'],
    },
    transmission: {
      type: String,
      default: 'Manual',
    },
    engine: {
      type: String,
      default: '2.0L 1-cylinder',
    },
    features: {
      type: Array,
      default: ['Apple Play', 'Leather', 'Sports Seats'],
    },
    color: {
      type: String,
    },
    price: {
      type: Number,
    },
    owner: {
      type: Number,
    },
    image: {
      type: String,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Car', CarSchema);
