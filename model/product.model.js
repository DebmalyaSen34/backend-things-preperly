import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    dishName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});

const product = mongoose.model("Product", productSchema);

export default product;