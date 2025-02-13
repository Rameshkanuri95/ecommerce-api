const couponSchema = new mongoose.Schema({
    code: String,
    discount: Number,
    expiryDate: Date,
});